const express = require('express');

const userController = require('../controllers/userController');
const { authToken } = require('../auth/isAuth')

const router = express.Router();

router.post('/login', userController.login)
router.post('/register', userController.register)

router.get('/', authToken, userController.getAllUser)
router.get('/:id', authToken, userController.getUser)
router.post('/find/email', userController.getUserByEmail)
router.post('/update', authToken, userController.updateUser)
router.delete('/delete/:id', authToken, userController.deleteUser)

module.exports = router