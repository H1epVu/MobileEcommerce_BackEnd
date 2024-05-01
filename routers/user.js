const express = require('express');

const userController = require('../controllers/userController');

const router = express.Router();

router.post('/login', userController.login)
router.post('/register', userController.register)

router.get('/', userController.getAllUser)
router.get('/:id', userController.getUser)
router.post('/find/email', userController.getUserByEmail)
router.post('/update', userController.updateUser)
router.delete('/delete/:id', userController.deleteUser)

module.exports = router