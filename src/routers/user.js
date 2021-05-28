const express = require('express')
const User = require('../models/user')
const router = express.Router()
const auth = require('../middleware/authorization')
const multer = require('multer')
const sharp = require('sharp')
const { welcomeEmail, ByebyeEmail } = require('../emails/account')

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

// Read Profile
router.get('/me', auth, async (req, res) => {
    res.send(req.user)
})

// Read Tasks from Profile
// router.get('/me/tasks', auth, async (req, res) => {
//     await req.user.populate('tasks').execPopulate()
//     console.log(req.user.tasks)
// })

// Sign UP
router.post('/signup', async (req, res) => {
    try {
        const user = new User(req.body)
        await user.save()
        welcomeEmail(user.email, user.name)
        const token = await user.generateAuthToken()
        res.status(201).send({ user, token })
    } catch (error) {
        res.status(400).send(error)
    }
})

// Login
router.post('/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()

        res.send({ user, token })
    } catch (error) {
        res.status(400).send(error.toString())
    }
})

// Logout
router.post('/logout', auth, async (req, res) => {
    if (req.query.all) {
        if (req.query.all === 'true') {
            try {
                req.user.tokens = []
                await req.user.save()

                res.send("Logged Out of All devices Successfully.")
            } catch (error) {
                res.status(500).send(error)
            }
        }
    } else if (req.query.exceptthis) {
        if (req.query.exceptthis === 'true') {
            try {
                req.user.tokens = req.user.tokens.filter((token) => {
                    return token.token === req.token
                })

                await req.user.save()

                res.send("Successfully Logged out of all devices except this.")
            } catch (error) {
                res.status(500).send(error)
            }
        }
    } else {
        try {
            req.user.tokens = req.user.tokens.filter((token) => {
                return token.token != req.token
            })

            await req.user.save()

            res.send("Logged Out Successfully")
        } catch (error) {
            res.status(500).send(error)
        }
    }

})

// Update Profile
router.patch('/me', auth, async (req, res) => {

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

// Delete Profile
router.delete('/me', auth, async (req, res) => {
    try {
        await req.user.remove()
        ByebyeEmail(req.user.email, req.user.name)
        res.send(req.user)
    } catch (error) {
        res.status(500).send(error)
    }
})

// Upload Profile Picture
router.post('/me/avatar', auth, upload.single('upload'), async (req, res) => {
    const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer()
    req.user.avatar = buffer
    await req.user.save()
    res.send()
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
})

// Delete Profile Picture
router.delete('/me/avatar', auth, async (req, res) => {
    req.user.avatar = undefined
    await req.user.save()
    res.send('Deleted Successfully')
})


// router.get('/users/:id/avatar', async (req, res) => {
//     try {
//         const user = await User.findById(req.params.id)

//         if (!user || !user.avatar) {
//             throw new Error('File not Found')
//         }

//         res.set('Content-Type', 'image/png')
//         res.send(user.avatar)

//     } catch (error) {
//         return res.status(404).send(error)
//     }
// })

// Read Profile Picture
router.get('/me/avatar', auth, async (req, res) => {
    try {
        if (!req.user.avatar) {
            return res.status(404).send('File not found')
        }

        res.set('Content-Type', 'image/png')
        res.send(req.user.avatar)
    } catch (error) {
        res.status(500).send(error)
    }
})

module.exports = router