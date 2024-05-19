const Order = require('../models/order')

//Get order by user id
exports.getUserOrders = async (req, res) => {
    const id = req.params.userId
    try {
        const order = await Order.find({ userId: id })
        return res.status(200).json(order)
    } catch (error) {
        console.log(error)
        return res.status(404).json({ message: error })
    }
}

//Get oder by status
exports.getOrderByStatus = async (req, res) => {
    const { status } = req.query
    try {
        const orders = await Order.find({ status: status })
        return res.status(200).json(orders)
    } catch (error) {
        console.log(error)
        return res.status(404).json({ message: error })
    }
}