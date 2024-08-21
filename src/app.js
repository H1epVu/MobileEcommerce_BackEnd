const express = require('express')
const cors = require("cors")
const bodyParser = require('body-parser')

const mongoose = require('mongoose');

const authRouters = require('../routers/auth')
const productRouters = require('../routers/product')
const userRouters = require('../routers/user')
const commentRouters = require('../routers/comment')
const orderRouters = require('../routers/order')
const paymentRouters = require('../routers/payment')
const mailRouters = require('../routers/mail')

require('dotenv').config()

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())

app.use(cors({ origin: true }))

app.use('/auth', authRouters)
app.use('/product', productRouters)
app.use('/comment', commentRouters)
app.use('/user', userRouters)
app.use('/order', orderRouters)
app.use('/payment', paymentRouters)
app.use('/mail', mailRouters)

const PORT = process.env.PORT || 8080

const connectToDatabase = async () => {
    try {
        await mongoose.connect(process.env.DB_URL);
        app.listen(PORT, () => {
            console.log('Server is running on ' + PORT);
        });
    } catch (err) {
        console.log(err);
    }
};

connectToDatabase();