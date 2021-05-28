const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const User = require('../../src/models/user')
const Task = require('../../src/models/task')

const User1Id = new mongoose.Types.ObjectId()
const User1 = {
    _id: User1Id,
    name: 'SomeName1',
    email: 'somethingmore1@example.com',
    password: 'thisIsp@ssw0rd',
    tokens: [
        {
            token: jwt.sign({ _id: User1Id }, process.env.JWT_SECRET)
        }
    ]
}

const User2Id = new mongoose.Types.ObjectId()
const User2 = {
    _id: User2Id,
    name: 'SomeName2',
    email: 'somethingmore2@example.com',
    password: 'thisp@ssIsco0l',
    tokens: [
        {
            token: jwt.sign({ _id: User2Id }, process.env.JWT_SECRET)
        }
    ]
}

const Task1 = {
    _id: new mongoose.Types.ObjectId(),
    description: 'Task1',
    completed: false,
    author: User1._id
}

const Task2 = {
    _id: new mongoose.Types.ObjectId(),
    description: 'Task2',
    completed: false,
    author: User1._id
}

const Task3 = {
    _id: new mongoose.Types.ObjectId(),
    description: 'Task3',
    completed: false,
    author: User2._id
}

const setDatabase = async () => {
    await Task.deleteMany()
    await User.deleteMany()
    await new User(User1).save()
    await new User(User2).save()
    await new Task(Task1).save()
    await new Task(Task2).save()
    await new Task(Task3).save()
}

module.exports = {
    User1,
    User2,
    Task1,
    Task3,
    setDatabase
}