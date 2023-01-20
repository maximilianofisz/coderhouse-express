const { createTransport } = require("nodemailer")

const mailer = createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: process.env.ADMIN_MAIL_ADDRESS,
        pass: process.env.ADMIN_MAIL_PASSWORD
    }
})

module.exports = mailer