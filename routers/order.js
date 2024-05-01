const express = require('express');

const orderController = require('../controllers/orderController');
const { authToken } = require('../auth/isAuth');

const router = express.Router();

router.get('/', authToken, orderController.getOrders)
router.get('/user/:userId', authToken, orderController.getUserOrders)
router.get('/:orderId', authToken, orderController.getOrderById)
router.post('/add', authToken, orderController.postOrder)
router.post('/update', authToken, orderController.updateOrder)

module.exports = router