const express = require('express');
const router = express.Router();
const mailController = require('../controllers/mail');

router.post('/sendEmail', mailController.sendMail);

module.exports = router;