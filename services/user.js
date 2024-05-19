const User = require('../models/user')

//Get User By Email
exports.getUserByEmail = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(200).json({ message: 'Không tìm thấy người dùng!' });
        }
        return res.status(200).json(user);
    } catch (error) {
        console.log(error)
    }
};