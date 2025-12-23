const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// Login
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(404).json({ message: 'Không tìm thấy người dùng!' });
        }
        
        // Use bcrypt to compare hashed password
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ message: 'Sai mật khẩu!' });
        }

        const token = jwt.sign(
            { email: user.email, userId: user._id.toString(), role: user.role },
            process.env.JWT_SECRET || 'secret',
            { expiresIn: '10h' }
        );

        return res.status(200).json({ token: token, user });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Đã xảy ra lỗi khi đăng nhập!' });
    }
};

// Register
exports.register = async (req, res) => {
    const { name, phone, email, address, password, role } = req.body;

    try {
        // Hash password before saving
        const saltRounds = 12;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        
        const user = new User({
            name: name,
            phone: phone,
            email: email,
            address: address,
            password: hashedPassword,
            role: role
        });

        const savedUser = await user.save();
        return res.status(201).json({ message: "Người dùng đã được tạo", savedUser });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Đã xảy ra lỗi khi đăng ký!' });
    }
};

// Get all Users
exports.getAllUser = async (req, res) => {
    try {
        const users = await User.find();
        return res.status(200).json(users);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Đã xảy ra lỗi khi lấy danh sách người dùng!' });
    }
};

// Get user by Id
exports.getUser = async (req, res) => {
    const id = req.params.id;
    try {
        const user = await User.findOne({ _id: id });
        if (user) {
            return res.status(200).json(user);
        } else {
            return res.status(404).json({ message: 'Không tìm thấy người dùng!' });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Đã xảy ra lỗi khi lấy thông tin người dùng!' });
    }
};

// Update User
exports.updateUser = async (req, res) => {
    const { id, name, phone, email, password, address, role, resetToken } = req.body;
    try {
        const data = {
            name: name,
            phone: phone,
            email: email,
            address: address,
            role: role,
            resetToken: resetToken
        };
        
        // Only hash password if it's being updated
        if (password) {
            const saltRounds = 12;
            data.password = await bcrypt.hash(password, saltRounds);
        }
        
        const user = await User.findOneAndUpdate({ _id: id }, data, { new: true });
        if (user) {
            res.status(200).json({ message: 'Người dùng đã được cập nhật', updatedUser: user });
        } else {
            res.status(404).json({ message: 'Không tìm thấy người dùng để cập nhật!' });
        }
    } catch (error) {
        console.error('Đã xảy ra lỗi khi cập nhật người dùng', error);
        res.status(500).json({ message: 'Đã xảy ra lỗi khi cập nhật người dùng.' });
    }
};

// Delete User
exports.deleteUser = async (req, res) => {
    const id = req.params.id;
    try {
        const result = await User.deleteOne({ _id: id });
        if (result.deletedCount > 0) {
            res.status(200).json({ message: "Người dùng đã bị xóa" });
        } else {
            res.status(404).json({ message: 'Không tìm thấy người dùng để xóa!' });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Đã xảy ra lỗi khi xóa người dùng!' });
    }
};

// Verify Token
exports.verifyToken = async (req, res) => {
    const { email, resetToken } = req.body;
    try {
        const user = await User.findOne({ email: email, resetToken: resetToken });
        if (!user) {
            return res.status(400).json({ message: 'Token không hợp lệ!' });
        }
        res.status(200).json({ message: 'Token hợp lệ!', userId: user._id });
    } catch (error) {
        console.error('Lỗi:', error);
        res.status(500).json({ message: 'Lỗi khi xác thực token.' });
    }
};