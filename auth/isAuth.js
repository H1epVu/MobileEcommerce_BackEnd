const jwt = require('jsonwebtoken');

const getJWTSecret = () => {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        console.warn('WARNING: JWT_SECRET not set in environment variables. Using fallback (INSECURE for production)');
        return 'secret';
    }
    if (secret.length < 32) {
        console.warn('WARNING: JWT_SECRET should be at least 32 characters long');
    }
    return secret;
};

exports.authToken = (req, res, next) => {
    const authHeader = req.get('Authorization');
    if (!authHeader) {
        return res.status(401).json({ message: 'Thiếu tiêu đề Authorization' });
    }
    
    const token = authHeader.split(' ')[1];
    let decodedToken;

    try {
        decodedToken = jwt.verify(token, getJWTSecret());
    } catch (error) {
        console.error('Lỗi xác minh token:', error);
        return res.status(401).json({ message: 'Token không hợp lệ hoặc đã hết hạn' });
    }

    if (!decodedToken) {
        return res.status(401).json({ message: 'Không thể giải mã token' });
    }

    req.userId = decodedToken.userId;
    req.userRole = decodedToken.role;
    next();
};

exports.createToken = (req, res) => {
    const { userId } = req.body;

    try {
        const token = jwt.sign({ userId }, getJWTSecret(), { expiresIn: '1h' });
        return res.status(200).json({ token });
    } catch (error) {
        console.error('Lỗi tạo token:', error);
        return res.status(500).json({ message: 'Đã có lỗi xảy ra!' });
    }
};
