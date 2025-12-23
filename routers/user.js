const express = require('express');
const { body, param, query, validationResult } = require('express-validator');

const userController = require('../controllers/user');
const userService = require('../services/user');
const { authToken } = require('../auth/isAuth');

const router = express.Router();

// Validation middleware
const validateRequest = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

router.post('/verify-token', 
    [
        body('email').isEmail().normalizeEmail(),
        body('resetToken').isString().trim().notEmpty()
    ],
    validateRequest,
    userController.verifyToken
);

router.post('/login', 
    [
        body('email').isEmail().normalizeEmail(),
        body('password').isString().isLength({ min: 6 }).trim()
    ],
    validateRequest,
    userController.login
);

router.post('/register', 
    [
        body('name').isString().trim().isLength({ min: 2, max: 100 }),
        body('phone').isNumeric(),
        body('email').isEmail().normalizeEmail(),
        body('address').optional().isString().trim().isLength({ max: 500 }),
        body('password').isString().isLength({ min: 6, max: 100 }),
        body('role').isIn(['user', 'admin'])
    ],
    validateRequest,
    userController.register
);

router.get('/find', 
    [
        query('email').isEmail().normalizeEmail()
    ],
    validateRequest,
    userService.getUserByEmail
);

router.post('/update', 
    authToken,
    [
        body('id').isMongoId(),
        body('name').optional().isString().trim().isLength({ min: 2, max: 100 }),
        body('phone').optional().isNumeric(),
        body('email').optional().isEmail().normalizeEmail(),
        body('password').optional().isString().isLength({ min: 6, max: 100 }),
        body('address').optional().isString().trim().isLength({ max: 500 }),
        body('role').optional().isIn(['user', 'admin']),
        body('resetToken').optional().isString().trim()
    ],
    validateRequest,
    userController.updateUser
);

router.delete('/delete/:id', 
    authToken,
    [
        param('id').isMongoId()
    ],
    validateRequest,
    userController.deleteUser
);

router.get('/:id', 
    authToken,
    [
        param('id').isMongoId()
    ],
    validateRequest,
    userController.getUser
);

router.get('/', authToken, userController.getAllUser);

module.exports = router