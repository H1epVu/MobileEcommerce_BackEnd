const Order = require('../models/order')

//Get all orders
exports.getOrders = async (req, res) => {
    try {
        const orders = await Order.find();
        return res.status(201).json({ message: 'ok', orders })
    } catch (error) {
        console.log(error)
        return res.status(404).json({ message: error })
    }
}

exports.getOrderById = async (req, res) => {
    const id = req.params.orderId
    try {
        const order = await Order.findOne({ _id: id });
        return res.status(201).json({ message: 'ok', order })
    } catch (error) {
        console.log(error)
        return res.status(404).json({ message: error })
    }
}

//Get order by user id
exports.getUserOrders = async (req, res) => {
    const id = req.params.userId
    try {
        const order = await Order.find({ userId: id })
        return res.status(201).json({ message: 'ok', order })
    } catch (error) {
        console.log(error)
        return res.status(404).json({ message: error })
    }
}

//Add Order
exports.postOrder = async (req, res) => {
    const { userId, userName, userPhone, total, cartItems, address, paymentMethod } = req.body
    try {
        const order = new Order({
            userId: userId,
            userName: userName,
            userPhone: userPhone,
            total: total,
            order_items: cartItems.map(item => ({
                product_id: item.id,
                name: item.name,
                quantity: item.quantity,
                price: item.price
            })),
            address: address,
            paymentMethod: paymentMethod
        })

        const savedOrder = await order.save()
        return res.status(201).json({ message: "ok", savedOrder })
    } catch (error) {
        console.log(error)
        return res.status(404).json({ message: error })
    }
}

//Update Order
exports.updateOrder = async (req, res) => {
    const { orderId, address, status } = req.body;
    try {
        const data = {
            status: status,
            address: address
        }
        const order = await Order.findOneAndUpdate({ _id: orderId }, data);
        res.json({ message: 'Order đã được cập nhật', updatedOrder: order });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Đã xảy ra lỗi khi cập nhật!' });
    }
}