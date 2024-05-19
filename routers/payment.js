const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/payment');

router.post('/pay', paymentController.createPayment);
router.get('/success', paymentController.paymentSuccess);

module.exports = router;