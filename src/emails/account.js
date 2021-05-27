const sendGridMail = require('@sendgrid/mail')

sendGridMail.setApiKey(process.env.SENDGRID_API_KEY)

// sendGridMail.send({
//     to: 'd_gamer_@outlook.com',
//     from: 'prajapatidhruv266@gmail.com',
//     subject: 'Test Mail',
//     text: 'hey there! this is sendgrid mail'
// })

const welcomeEmail = (email, name) => {
    sendGridMail.send({
        to: email,
        from: 'prajapatidhruv266@gmail.com',
        subject: 'Welcome',
        text: `Welcome to the App, ${name}`
    })
}

const ByebyeEmail = (email, name) => {
    sendGridMail.send({
        to: email,
        from: 'prajapatidhruv266@gmail.com',
        subject: 'See you soon!',
        text: `Bye Bye ${name}`
    })
}

module.exports = {
    welcomeEmail,
    ByebyeEmail
}