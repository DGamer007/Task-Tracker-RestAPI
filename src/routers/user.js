const express = require('express')
const User = require('../models/user')
const router = express.Router()
const auth = require('../middleware/authorization')
const multer = require('multer')
const sharp = require('sharp')
const { welcomeEmail, ByebyeEmail } = require('../emails/account')

// Read Profile
router.get('/users/me', auth, async (req, res) => {
    res.send(req.user)
})

// Read Tasks
router.get('/users/me/tasks', auth, async (req, res) => {
    await req.user.populate('tasks').execPopulate()
    console.log(req.user.tasks)
})

// Sign UP      or      Create new User
router.post('/users', async (req, res) => {
    try {
        const user = new User(req.body)
        await user.save()
        welcomeEmail(user.email, user.name)
        const token = await user.generateAuthToken()
        res.send({ user, token })
    } catch (error) {
        res.status(400).send(error)
    }
})

// Login
router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()

        res.send({ user, token })
    } catch (error) {
        res.status(400).send(error.toString())
    }
})

// Logout from Current Device
router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token != req.token
        })

        await req.user.save()

        res.send("Logged Out Successfully")
    } catch (e) {
        res.status(500).send(e)
    }
})

// Logout from all the devices
router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()

        res.send("Logged Out of All devices Successfully.")
    } catch (e) {
        res.status(500).send(e)
    }
})

// Logout from all the devices except Current Device
router.post('/users/logoutAllExceptThis', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token === req.token
        })

        await req.user.save()

        res.send("Successfully Logged out of all devices except this.")
    } catch (error) {

    }
})

// Update User Profile
router.patch('/users/me', auth, async (req, res) => {

    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'age', 'email', 'password']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid Operation' })
    }

    try {
        updates.forEach((update) => {
            req.user[update] = req.body[update]
        })
        await req.user.save()

        res.send(req.user)
    } catch (error) {
        res.status(400).send(error)
    }
})

// Delete User Profile
router.delete('/users/me', auth, async (req, res) => {
    try {
        await req.user.remove()
        ByebyeEmail(req.user.email, req.user.name)
        res.send(req.user)
    } catch (error) {
        res.status(500).send(error)
    }
})

const upload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, callback) {
        if (!file.originalname.match(/\.(jpg|png|jpeg)$/)) {
            return callback(new Error('Please upload an Image.'))
        }

        callback(undefined, true)
    }
})

// Upload Profile Picture
router.post('/users/me/avatar', auth, upload.single('upload'), async (req, res) => {
    const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer()
    req.user.avatar = buffer
    await req.user.save()
    res.send()
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
})

router.delete('/users/me/avatar', auth, async (req, res) => {
    req.user.avatar = undefined
    await req.user.save()
    res.send('Deleted Successfully')
})

router.get('/users/:id/avatar', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)

        if (!user || !user.avatar) {
            throw new Error('File not Found')
        }

        res.set('Content-Type', 'image/png')
        res.send(user.avatar)

    } catch (error) {
        return res.status(404).send(error)
    }
})
module.exports = router