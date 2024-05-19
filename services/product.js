const Product = require('../models/product');

//Get Product by Name
exports.getProductByName = async (req, res) => {
    const prodName = req.params.productName;
    try {
        const products = await Product.find({ name: { $regex: prodName, $options: 'i' } })
        res.status(201).json(products)
    } catch (error) {
        console.log(error)
    }
}

//Update Product Quantity
exports.updateProdQuantity = async (req, res) => {
    const { id, quantity } = req.body;
    try {
        await Product.findByIdAndUpdate(id, { $inc: { quantity: quantity } })
        res.status(200).json({ message: 'Số lượng đã được cập nhật' })
    } catch (err) {
        console.log(error);
        res.status(500).json({ message: 'Đã xảy ra lỗi khi cập nhật!' });
    }
}
