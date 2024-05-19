const User = require('../models/user')
const jwt = require('jsonwebtoken')

//Login
exports.login = async (req, res) => {
    const { email, password } = req.body

    try {
        const user = await User.findOne({ email: email })
        if (!user) {
            return res.status(201).json({ message: 'Không tìm thấy người dùng!' })
        }
        if (password != user.password) {
            return res.status(201).json({ message: 'Sai mật khẩu!' })
        }

        const token = jwt.sign({ email: user.email, userId: user._id.toString() }, 'secret', { expiresIn: '10h' })

        return res.status(200).json({ token: token, user })
    } catch (error) {
        console.log(error)
    }
}

//Register
exports.register = async (req, res) => {
    const { name, phone, email, address, password, role } = req.body;

    try {
        const user = new User({
            name: name,
            phone: phone,
            email: email,
            address: address,
            password: password,
            role: role
        })

        const savedUser = await user.save()
        return res.status(201).json({ message: "ok", savedUser })
    } catch (error) {
        console.log(error)
    }
}

//Get all User
exports.getAllUser = async (req, res) => {
    try {
        const users = await User.find();
        return res.status(201).json(users)

    } catch (error) {
        console.log(error)
    }
}

//Get user by id
exports.getUser = async (req, res) => {
    const id = req.params.id
    try {
        const user = await User.findOne({ _id: id });
        return res.status(201).json(user)
    } catch (error) {
        console.log(error)
    }
}

//Update User
exports.updateUser = async (req, res) => {
    const { id, name, phone, email, password, address, resetToken } = req.body;
    try {
        const data = {
            name: name,
            phone: phone,
            email: email,
            address: address,
            password: password,
            resetToken: resetToken
        }
        const user = await User.findOneAndUpdate({ _id: id }, data);
        res.json({ message: 'Người dùng đã được cập nhật', updatedUser: user });

    } catch (error) {
        console.error('Đã xảy ra lỗi khi cập nhật người dùng', error);
        res.status(500).json({ message: 'Đã xảy ra lỗi khi cập nhật người dùng.' });
    }
}

//Delete User
exports.deleteUser = async (req, res) => {
    const id = req.params.id;
    try {
        await User.deleteOne({ _id: id });
        res.status(200).json({ message: "ok" })
    } catch (error) {
        console.log(error)
    }
}

//Verify Token
exports.verifyToken = async (req, res) => {
    const { email, resetToken } = req.body;
    try {
        const user = await User.findOne({ email: email, resetToken: resetToken });
        if (!user) {
            return res.status(200).json({ message: 'Token không hợp lệ!' });
        }
        res.status(200).json({ message: 'Token hợp lệ!', userId: user._id });
    } catch (error) {
        console.error('Lỗi:', error);
        res.status(500).json({ message: 'Lỗi không xác thực thành công.' });
    }
};