const User = require('../models/user')
const nodemailer = require('nodemailer');
require('dotenv').config()

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
    }
});

//Send resetToken
exports.sendMail = async (req, res) => {
    const { email } = req.body;

    const resetToken = Math.random().toString(36).substring(7);

    try {
        const user = await User.findOneAndUpdate({ email }, { resetToken }, { new: true });

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        const mailOptions = {
            from: process.env.EMAIL_USERNAME,
            to: email,
            subject: 'Reset Your Password',
            text: `You are receiving this email because you requested to reset your password. Your reset token is: ${resetToken}`
        };

        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'Password reset instructions sent to your email.' });

    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ message: 'Failed to send password reset email.' });
    }
}