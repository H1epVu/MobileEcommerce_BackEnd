const express = require('express');

const userController = require('../controllers/user');
const userService = require('../services/user');
const { authToken } = require('../auth/isAuth')

const router = express.Router();

router.post('/verify-token', userController.verifyToken);
router.post('/login', userController.login);
router.post('/register', userController.register);
router.get('/find', userService.getUserByEmail);

router.post('/update', authToken, userController.updateUser);
router.delete('/delete/:id', authToken, userController.deleteUser);
router.get('/:id', authToken, userController.getUser);
router.get('/', authToken, userController.getAllUser);

module.exports = router