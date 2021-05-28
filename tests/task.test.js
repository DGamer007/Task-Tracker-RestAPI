const request = require('supertest')
const Task = require('../src/models/task')
const app = require('../src/app')
const { User1, Task1, Task3, User2, setDatabase } = require('./fixtures/testDatabase')

beforeEach(setDatabase)

test('Should Create Task', async () => {
    const response = await request(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${User1.tokens[0].token}`)
        .send({
            description: 'Some Other Task',
            completed: false
        }).expect(201)

    const task = await Task.findById(response.body._id)
    expect(task).toMatchObject({
        description: 'Some Other Task',
        completed: false
    })
})

test('Should not Create Task without Authorization', async () => {
    await request(app)
        .post('/tasks')
        .send({
            description: 'Some Other Task',
            completed: false
        })
        .expect(401)
})

test('Should not Create Task with Invalid Details', async () => {
    await request(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${User1.tokens[0].token}`)
        .send({
            completed: 'true'
        })
        .expect(400)
})

test('Should Read all Tasks of a User', async () => {
    const response = await request(app)
        .get('/tasks/me')
        .set('Authorization', `Bearer ${User1.tokens[0].token}`)
        .send()
        .expect(200)

    expect(response.body.length).toEqual(2)
})

test('Should not Read Tasks without Authorization', async () => {
    const response = await request(app)
        .get('/tasks/me')
        .send()
        .expect(401)
})

test('Should not Read Tasks of Other User', async () => {
    const response = await request(app)
        .get(`/tasks/${Task3._id}`)
        .set('Authorization', `Bearer ${User1.tokens[0].token}`)
        .send()
        .expect(404)
})

test('Should Delete Tasks of User', async () => {
    await request(app)
        .delete(`/tasks/${Task1._id}`)
        .set('Authorization', `Bearer ${User1.tokens[0].token}`)
        .send()
        .expect(200)

    const task = await Task.findById(Task1._id)
    expect(task).toBeNull()
})

test('Should not Delete Task without Authorization', async () => {
    await request(app)
        .delete(`/tasks/${Task1._id}`)
        .send()
        .expect(401)

    const task = await Task.findById(Task1._id)
    expect(task).not.toBeNull()
})

test('Should not Delete Task of other Users', async () => {
    await request(app)
        .delete(`/tasks/${Task1._id}`)
        .set('Authorization', `Bearer ${User2.tokens[0].token}`)
        .send()
        .expect(404)

    const task = await Task.findById(Task1._id)
    expect(task).not.toBeNull()
})

test('Should Update Task', async () => {
    await request(app)
        .patch(`/tasks/${Task1._id}`)
        .set('Authorization', `Bearer ${User1.tokens[0].token}`)
        .send({
            description: 'Changed Task',
            completed: false
        })
        .expect(200)

    const task = await Task.findById(Task1._id)
    expect(task.description).toBe('Changed Task')
})

test('Should not Update Task with Invalid details', async () => {
    await request(app)
        .patch(`/tasks/${Task1._id}`)
        .set('Authorization', `Bearer ${User1.tokens[0].token}`)
        .send({
            name: 'Changed Task',
            completed: false
        })
        .expect(400)

    const task = await Task.findById(Task1._id)
    expect(task.description).not.toBe('Changed Task')
})

test('Should not Update Task of other Users', async () => {
    await request(app)
        .patch(`/tasks/${Task3._id}`)
        .set('Authorization', `Bearer ${User1.tokens[0].token}`)
        .send({
            description: 'Changed Task',
            completed: true
        })
        .expect(404)

    const task = await Task.findById(Task3._id)
    expect(task.description).not.toBe('Changed Task')
})

test('Should not Update Task without Authorization', async () => {
    await request(app)
        .patch(`/tasks/${Task1._id}`)
        .send({
            description: 'Changed Task',
            completed: true
        })
        .expect(401)

    const task = await Task.findById(Task1._id)
    expect(task.description).not.toBe('Changed Task')
})