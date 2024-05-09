const jwt = require('jsonwebtoken')

exports.authToken = (req, res, next) => {
    const authHeader = req.get('Authorization')
    if (!authHeader) {
        const error = new Error('Authorization header is missing');
        error.statusCode = 401;
        throw error;
    }
    const token = req.get('Authorization').split(' ')[1];
    let decodedToken
    try {
        decodedToken = jwt.verify(token, 'secret');
    } catch (error) {
        error.statusCode = 401
        throw error
    }
    if (!decodedToken) {
        err.statusCode = 401
        throw err
    }
    req.userId = decodedToken.userId;
    next();
}


exports.createToken = (req, res) => {
    const { userId } = req.body;

    try {
        const token = jwt.sign({ userId }, 'secret', { expiresIn: '1h' });
        res.status(200).json({ token });

    } catch (error) {
        console.error('Error creating Token:', error);
        res.status(500).json({ message: 'Something went wrong!' });
    }
}