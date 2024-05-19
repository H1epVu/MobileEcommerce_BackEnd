const Product = require('../models/product');

//Get All Products
exports.getAllProduct = async (req, res) => {
    try {
        const products = await Product.find()
        res.status(201).json(products)
    } catch (error) {
        console.log(error);
    }
}

//Get Product by Id
exports.getProduct = async (req, res) => {
    const prodId = req.params.productId;
    try {
        const product = await Product.findById(prodId)
        res.status(201).json(product)
    } catch (error) {
        console.log(error)
    }
}

//Add Product
exports.addProduct = async (req, res) => {
    const { name, price, imageUrl, description, quantity, status } = req.body;

    try {
        const product = new Product({
            name: name,
            price: price,
            imageUrl: imageUrl,
            description: description,
            quantity: quantity,
            status: status
        })
        const savedProduct = await product.save()
        res.status(201).json(savedProduct)
    } catch (error) {
        console.log(error)
    }
}

//Update Product
exports.updateProduct = async (req, res) => {
    const { id, name, price, imageUrl, description, quantity, status } = req.body;
    try {
        const data = {
            name: name,
            price: price,
            imageUrl: imageUrl,
            description: description,
            quantity: quantity,
            status: status
        }
        const prod = await Product.findOneAndUpdate({ _id: id }, data);
        res.status(201).json({ message: 'Sản phẩm đã được cập nhật', updatedProduct: prod });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Đã xảy ra lỗi khi cập nhật!' });
    }
}

//Delete Producte
exports.deleteProduct = async (req, res) => {
    const prodId = req.params.productId;
    try {
        await Product.deleteOne({ _id: prodId });
        res.status(200).json({ message: "ok" })
    } catch (error) {
        console.log(error)
    }
}