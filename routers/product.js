const express = require('express');

const productController = require('../controllers/productController');
const { authToken } = require('../auth/isAuth')

const router = express.Router();

router.get('/', productController.getAllProduct);
router.get('/detail/:productId', productController.getProduct);
router.post('/add', authToken, productController.addProduct);
router.post('/update', authToken, productController.updateProduct);
router.delete('/delete/:productId', authToken, productController.deleteProduct)

module.exports = router