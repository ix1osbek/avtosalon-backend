const nodemailer = require('nodemailer')



const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
})

const sendEmail = async (email, code) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Email Tasdiqlash',
            text: `Sizning tasdiqlash kodingiz: ${code}`,
        }

        await transporter.sendMail(mailOptions)
    } catch (error) {
        console.error('Email yuborishda xatolik:', error)
    }
}

module.exports = sendEmail