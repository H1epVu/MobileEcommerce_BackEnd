const express = require('express');

const orderController = require('../controllers/order');
const orderService = require('../services/order');
const { authToken } = require('../auth/isAuth');

const router = express.Router();

router.post('/add', authToken, orderController.postOrder)
router.post('/update', authToken, orderController.updateOrder)
router.get('/totalRevenue', authToken, orderService.getRevenue)
router.get('/ordersByDate', orderService.getOrdersByDate)
router.get('/status', authToken, orderService.getOrderByStatus)
router.get('/user/:userId', authToken, orderService.getUserOrders)
router.get('/:orderId', authToken, orderController.getOrderById)
router.get('/', authToken, orderController.getOrders)

module.exports = router