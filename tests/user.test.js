const request = require('supertest')
const app = require('../src/app')
const User = require('../src/models/user')
const { User1, setDatabase } = require('./fixtures/testDatabase')

beforeEach(setDatabase)

test('Should Signup', async () => {
    const response = await request(app)
        .post('/signup')
        .send({
            name: 'SomeName',
            email: 'something@example.com',
            password: 'thisIsp@ssw0rd'
        }).expect(201)

    const user = await User.findById(response.body.user._id)
    expect(user).not.toBeNull()

    expect(response.body).toMatchObject({
        user: {
            name: 'SomeName',
            email: 'something@example.com'
        },
        token: user.tokens[0].token
    })

    expect(user.password).not.toBe('thisIsp@ssw0rd')
})

test('Should not Signup with same email ID', async () => {
    await request(app)
        .post('/signup')
        .send({
            name: 'SomeName',
            email: 'somethingmore1@example.com',
            password: 'thisisp@ssw0rd'
        }).expect(400)
})

test('Should not Signup with invalid details', async () => {

    const fakeUsers = [
        {
            name: 123234,
            email: 'something@example.com',
            password: 'thisIsstr0ngp@ss'
        },
        {
            name: 'SomeName',
            email: 'SomeEmail',
            password: 'thisIsstr0ngp@ss'
        },
        {
            name: 'SomeName',
            email: 'something@example.com',
            password: 'passwordisCo0!'
        },
        {
            name: 123234,
            email: 'something@example.com',
            password: 'passwordisCo0!'
        }
    ]

    request(app)
        .post('/signup')
        .send(fakeUsers[0])
        .expect(400)

    request(app)
        .post('/signup')
        .send(fakeUsers[1])
        .expect(400)

    request(app)
        .post('/signup')
        .send(fakeUsers[2])
        .expect(400)

    request(app)
        .post('/signup')
        .send(fakeUsers[3])
        .expect(400)
})

test('Should Login', async () => {
    const response = await request(app)
        .post('/login')
        .send({
            email: User1.email,
            password: User1.password
        })
        .expect(200)

    const user = await User.findById(User1._id)

    expect(response.body.token).toBe(user.tokens[user.tokens.length - 1].token)
})

test('Should not Login with false credentials', async () => {
    await request(app)
        .post('/login')
        .send({
            email: User1.email,
            password: 'thisispass'
        }).expect(400)
})

test('Should Read Profile', async () => {
    await request(app)
        .get('/me')
        .set('Authorization', `Bearer ${User1.tokens[0].token}`)
        .send()
        .expect(200)
})

test('Should not Read Profile without Authorization', async () => {
    await request(app)
        .get('/me')
        .send()
        .expect(401)
})

test('Should Delete Account', async () => {
    await request(app)
        .delete('/me')
        .set('Authorization', `Bearer ${User1.tokens[0].token}`)
        .send()
        .expect(200)

    const user = await User.findById(User1._id)
    expect(user).toBeNull()
})

test('Should not Delete Account without Authorization', async () => {
    await request(app)
        .delete('/me')
        .send()
        .expect(401)
})

test('Should Upload Avatar', async () => {
    await request(app)
        .post('/me/avatar')
        .set('Authorization', `Bearer ${User1.tokens[0].token}`)
        .attach('upload', 'tests/fixtures/pic.jpg')
        .expect(200)

    const user = await User.findById(User1._id)
    expect(user.avatar).toEqual(expect.any(Buffer))
})

test('Should Update details', async () => {
    await request(app)
        .patch('/me')
        .set('Authorization', `Bearer ${User1.tokens[0].token}`)
        .send({
            name: 'SomeName3'
        })
        .expect(200)

    const user = await User.findById(User1._id)
    expect(user.name).toBe('SomeName3')
})

test('Should not Update User without Authorization', async () => {
    await request(app)
        .patch('/me')
        .send({
            name: 'SomeName3'
        })
        .expect(401)
})

test('Should not Update User with Invalid details', async () => {
    await request(app)
        .patch('/me')
        .set('Authorization', `Bearer ${User1.tokens[0].token}`)
        .send({
            location: 'SomeCountry'
        })
        .expect(400)
})