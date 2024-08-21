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
    try {
        const weekStartDate = new Date();
        weekStartDate.setHours(0, 0, 0, 0);
        weekStartDate.setDate(weekStartDate.getDate() - weekStartDate.getDay());

        const weekRevenue = await Order.aggregate([
            {
                $match: {
                    orderDate: { $gte: weekStartDate },
                    status: "closed"
                }
            },
            {
                $group: {
                    _id: { week: { $week: "$orderDate" }, year: { $year: "$orderDate" } },
                    totalRevenue: { $sum: "$total" }
                }
            },
            { $sort: { "_id.year": 1, "_id.week": 1 } }
        ]);

        const monthStartDate = new Date();
        monthStartDate.setHours(0, 0, 0, 0);
        monthStartDate.setDate(1);

        const monthRevenue = await Order.aggregate([
            {
                $match: {
                    orderDate: { $gte: monthStartDate },
                    status: "closed"
                }
            },
            {
                $group: {
                    _id: { month: { $month: "$orderDate" }, year: { $year: "$orderDate" } },
                    totalRevenue: { $sum: "$total" }
                }
            },
            { $sort: { "_id.year": 1, "_id.month": 1 } }
        ]);

        const weekTotal = weekRevenue.length > 0 ? weekRevenue[0].totalRevenue : 0;
        const monthTotal = monthRevenue.length > 0 ? monthRevenue[0].totalRevenue : 0;

        // Gửi kết quả về client
        res.status(200).json({ weekTotal, monthTotal });
    } catch (error) {
        console.error('Error fetching revenue:', error);
        return res.status(500).json({ message: 'Unable to fetch revenue.' });
    }
};
