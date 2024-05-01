const express = require('express');

const productController = require('../controllers/productController');

const router = express.Router();

router.get('/', productController.getAllProduct);
router.get('/detail/:productId', productController.getProduct);
router.post('/add', productController.addProduct);
router.post('/update', productController.updateProduct);
router.delete('/delete/:productId', productController.deleteProduct)

module.exports = router