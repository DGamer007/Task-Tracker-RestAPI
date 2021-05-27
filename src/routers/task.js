const express = require('express')
const Task = require('../models/task')
const auth = require('../middleware/authorization')
const router = express.Router()

// Read User Profile
router.get('/tasks/user', auth, async (req, res) => {
    console.log(req.user)
})

// Read all tasks for current user
router.get('/tasks/me', auth, async (req, res) => {
    const match = {}
    const sort = {}

    if (req.query.completed) {
        match.completed = req.query.completed === 'true'
    }
    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }

    try {
        await req.user.populate({
            path: 'tasks',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        }).execPopulate()
        res.send(req.user.tasks)
    } catch (error) {
        res.status(500).send(error)
    }
})

// Read task by TASKid
router.get('/tasks/:id', auth, async (req, res) => {
    try {
        const task = await Task.findOne({ _id: req.params.id, author: req.user._id })

        if (!task) {
            return res.status(404).send('No data found!')
        }
        res.send(task)
    } catch (error) {
        res.status(500).send(error)
    }
})

// Create Task
router.post('/tasks', auth, async (req, res) => {
    try {
        const task = new Task({
            ...req.body,
            author: req.user._id
        })
        await task.save()
        res.status(201).send(task)

    } catch (error) {
        res.status(400).send(error)
    }
})

// Update Task by TASKid
router.patch('/tasks/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'completed']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid Operation.' })
    }

    try {
        const task = await Task.findOne({ _id: req.params.id, author: req.user._id })
        if (!task) {
            return res.status(404).send('No Data Found!')
        }
        updates.forEach((update) => {
            task[update] = req.body[update]
        })
        await task.save()

        res.send(task)
    } catch (error) {
        res.status(400).send(error)
    }
})

// Delete Task by TASKid
router.delete('/tasks/:id', auth, async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({ _id: req.params.id, author: req.user._id })
        if (!task) {
            return res.status(404).send('No Data found!')
        }

        res.send(task)
    } catch (error) {
        res.status(500).send(error)
    }
})

module.exports = router