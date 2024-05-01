const express = require('express');

const orderController = require('../controllers/orderController');

const router = express.Router();

router.get('/', orderController.getOrders)
router.get('/user/:userId', orderController.getUserOrders)
router.get('/:orderId', orderController.getOrderById)
router.post('/add', orderController.postOrder)
router.post('/update', orderController.updateOrder)

module.exports = router