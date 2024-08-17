const Order = require('../models/order');

exports.getUserOrders = async (req, res) => {
    const id = req.params.userId;
    try {
        const order = await Order.find({ userId: id });
        return res.status(200).json(order);
    } catch (error) {
        console.error('Error fetching user orders:', error);
        return res.status(404).json({ message: 'Unable to fetch user orders.' });
    }
};

exports.getOrderByStatus = async (req, res) => {
    const { status } = req.query;
    try {
        const orders = await Order.find({ status: status });
        return res.status(200).json(orders);
    } catch (error) {
        console.error('Error fetching orders by status:', error);
        return res.status(404).json({ message: 'Unable to fetch orders by status.' });
    }
};

exports.getOrdersByDate = async (req, res) => {
    try {
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        const orders = await Order.find({
            orderDate: {
                $gte: startOfDay,
                $lte: endOfDay
            }
        });

        return res.status(200).json(orders);
    } catch (error) {
        console.error('Error fetching orders by date:', error);
        return res.status(404).json({ message: 'Unable to fetch orders by date.' });
    }
};

exports.getRevenue = async (req, res) => {
    const { type } = req.query;
    let startDate;
    let groupBy;

    if (type === 'week') {
        startDate = new Date();
        startDate.setHours(0, 0, 0, 0);
        startDate.setDate(startDate.getDate() - startDate.getDay());
        groupBy = { week: { $week: "$orderDate" }, year: { $year: "$orderDate" } };
    } else if (type === 'month') {
        startDate = new Date();
        startDate.setHours(0, 0, 0, 0);
        startDate.setDate(1);
        groupBy = { month: { $month: "$orderDate" }, year: { $year: "$orderDate" } };
    } else {
        throw new Error("Invalid type parameter. Use 'week' or 'month'.");
    }

    try {
        const revenue = await Order.aggregate([
            {
                $match: {
                    orderDate: { $gte: startDate },
                    status: "closed"
                }
            },
            {
                $group: {
                    _id: groupBy,
                    totalRevenue: { $sum: "$total" }
                }
            },
            {
                $sort: { "_id.year": 1, ...(type === 'week' ? { "_id.week": 1 } : { "_id.month": 1 }) }
            }
        ]);

        res.status(200).json(revenue);
    } catch (error) {
        console.error('Error fetching revenue:', error);
        return res.status(404).json({ message: 'Unable to fetch revenue.' });
    }
};