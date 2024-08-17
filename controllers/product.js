const Product = require('../models/product');

// Get All Products
exports.getAllProduct = async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json(products);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Đã xảy ra lỗi khi lấy danh sách sản phẩm!' });
    }
}

// Get Product by Id
exports.getProduct = async (req, res) => {
    const prodId = req.params.productId;
    try {
        const product = await Product.findById(prodId);
        if (product) {
            res.status(200).json(product);
        } else {
            res.status(404).json({ message: 'Không tìm thấy sản phẩm!' });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Đã xảy ra lỗi khi lấy thông tin sản phẩm!' });
    }
}

// Add Product
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
        });
        const savedProduct = await product.save();
        res.status(201).json(savedProduct);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Đã xảy ra lỗi khi thêm sản phẩm!' });
    }
}

// Update Product
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
        };
        const prod = await Product.findOneAndUpdate({ _id: id }, data, { new: true });
        if (prod) {
            res.status(200).json({ message: 'Sản phẩm đã được cập nhật', updatedProduct: prod });
        } else {
            res.status(404).json({ message: 'Không tìm thấy sản phẩm để cập nhật!' });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Đã xảy ra lỗi khi cập nhật!' });
    }
}

// Delete Product
exports.deleteProduct = async (req, res) => {
    const prodId = req.params.productId;
    try {
        const result = await Product.deleteOne({ _id: prodId });
        if (result.deletedCount > 0) {
            res.status(200).json({ message: "Sản phẩm đã bị xóa" });
        } else {
            res.status(404).json({ message: 'Không tìm thấy sản phẩm để xóa!' });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Đã xảy ra lỗi khi xóa sản phẩm!' });
    }
}