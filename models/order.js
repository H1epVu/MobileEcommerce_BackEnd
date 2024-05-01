const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const orderSchema = new Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true
    },
    userName: {
        type: String

    },
    userPhone: {
        type: String

    },
    order_items: [{
        product_id: {
            type: mongoose.Types.ObjectId,
            ref: 'Product', 
        },
        name: {
            type: String,
            required: true
        },
        quantity: {
            type: Number,
            required: true
        },
        price: {
            type: Number,
            required: true
        }
    }]
    ,total: {
        type: Number,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    orderDate: {
        type: Date,
        default: Date.now
    },
    paymentMethod: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: 'open',
        required: true
    }
})

module.exports = mongoose.model('Order', orderSchema);