const sendGridMail = require('@sendgrid/mail')

sendGridMail.setApiKey(process.env.SENDGRID_API_KEY)

const welcomeEmail = (email, name) => {
    sendGridMail.send({
        to: email,
        from: process.env.SENDGRID_SENDER_EMAIL,
        subject: 'Welcome',
        text: `Welcome to the App, ${name}`
    })
}

const ByebyeEmail = (email, name) => {
    sendGridMail.send({
        to: email,
        from: process.env.SENDGRID_SENDER_EMAIL,
        subject: 'See you soon!',
        text: `Bye Bye ${name}`
    })
}

module.exports = {
    welcomeEmail,
    ByebyeEmail
}