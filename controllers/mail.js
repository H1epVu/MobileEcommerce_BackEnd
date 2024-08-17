const User = require('../models/user');
const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
    }
});

// Send resetToken
exports.sendMail = async (req, res) => {
    const { email } = req.body;
    const resetToken = Math.random().toString(36).substring(7);

    try {
        const user = await User.findOneAndUpdate({ email }, { resetToken }, { new: true });

        if (!user) {
            return res.status(404).json({ message: 'Không tìm thấy người dùng.' });
        }

        const mailOptions = {
            from: process.env.EMAIL_USERNAME,
            to: email,
            subject: 'Reset Your Password',
            text: `Bạn nhận được email này vì đã yêu cầu đặt lại mật khẩu. Mã token của bạn là: ${resetToken}`
        };

        await transporter.sendMail(mailOptions);
        return res.status(200).json({ message: 'Hướng dẫn đặt lại mật khẩu đã được gửi đến email của bạn.' });

    } catch (error) {
        console.error('Lỗi khi gửi email:', error);
        return res.status(500).json({ message: 'Gửi email đặt lại mật khẩu thất bại.' });
    }
};
