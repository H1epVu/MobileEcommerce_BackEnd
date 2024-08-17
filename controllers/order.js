const Order = require('../models/order');

// Get all orders
exports.getOrders = async (req, res) => {
    try {
        const orders = await Order.find();
        return res.status(200).json(orders);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Đã xảy ra lỗi khi lấy danh sách đơn hàng!' });
    }
};

// Get order by Id
exports.getOrderById = async (req, res) => {
    const id = req.params.orderId;
    try {
        const order = await Order.findOne({ _id: id });
        if (order) {
            return res.status(200).json(order);
        } else {
            return res.status(404).json({ message: 'Không tìm thấy đơn hàng!' });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Đã xảy ra lỗi khi lấy thông tin đơn hàng!' });
    }
};

// Add Order
exports.postOrder = async (req, res) => {
    const { userId, userName, userPhone, total, cartItems, address, paymentMethod } = req.body;
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
        });

        const savedOrder = await order.save();
        return res.status(201).json({ message: "Đơn hàng đã được tạo", savedOrder });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Đã xảy ra lỗi khi tạo đơn hàng!' });
    }
};

// Update Order
exports.updateOrder = async (req, res) => {
    const { orderId, address, status } = req.body;
    try {
        const data = {
            status: status,
            address: address
        };
        const order = await Order.findOneAndUpdate({ _id: orderId }, data, { new: true });
        if (order) {
            res.status(200).json({ message: 'Đơn hàng đã được cập nhật', updatedOrder: order });
        } else {
            res.status(404).json({ message: 'Không tìm thấy đơn hàng để cập nhật!' });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Đã xảy ra lỗi khi cập nhật đơn hàng!' });
    }
};