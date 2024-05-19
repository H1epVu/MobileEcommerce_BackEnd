const express = require('express');

const userController = require('../controllers/user');
const userService = require('../services/user');
const { authToken } = require('../auth/isAuth')

const router = express.Router();

router.post('/update', authToken, userController.updateUser)
router.post('/find/email', userService.getUserByEmail)
router.delete('/delete/:id', authToken, userController.deleteUser)
router.get('/:id', authToken, userController.getUser)
router.post('/verify-token', userController.verifyToken)
router.post('/login', userController.login)
router.post('/register', userController.register)
router.get('/', authToken, userController.getAllUser)

module.exports = router