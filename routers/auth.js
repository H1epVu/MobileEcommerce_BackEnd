const express = require('express');
const router = express.Router();
const { createToken } = require('../auth/isAuth')

router.post('/create-token', createToken);

module.exports = router;