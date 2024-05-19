const express = require('express');

const productController = require('../controllers/product');
const productService = require('../services/product');
const { authToken } = require('../auth/isAuth')

const router = express.Router();

router.post('/updateQuantity', authToken, productService.updateProdQuantity);
router.post('/update', authToken, productController.updateProduct);
router.delete('/delete/:productId', authToken, productController.deleteProduct)
router.get('/:productName', productService.getProductByName);
router.post('/add', authToken, productController.addProduct);
router.get('/detail/:productId', productController.getProduct);
router.get('/', productController.getAllProduct);

module.exports = router