const User = require('../models/user')

//Get User By Email
exports.getUserByEmail = async (req, res) => {
    const { email } = req.query
    try {
        const user = await User.findOne({ email: email });
        if (user) {
            return res.status(200).json({ message: 'Người dùng đã tồn tại!', user });
        }

        return res.status(404).json({ message: 'Không tìm thấy người dùng!' });
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'Đã xảy ra lỗi khi tìm người dùng.' });
    }
};
