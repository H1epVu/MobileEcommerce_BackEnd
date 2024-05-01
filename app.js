const express = require('express')
const bodyParser = require('body-parser')

const mongoose = require('mongoose');

const productRouters = require('./routers/product')
const userRouters = require('./routers/user')
const orderRouters = require('./routers/order')
const paymentRouters = require('./routers/payment')
const paypal = require('paypal-rest-sdk');

// Configure PayPal SDK with client ID and secret
paypal.configure({
    'mode': 'sandbox',
    'client_id': process.env.CLIENT_ID,
    'client_secret': process.env.CLIENT_SECRET
});

require('dotenv').config()

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', process.env.ACCESS_CONTROL_ALLOW_ORIGIN);
    res.setHeader('Access-Control-Allow-Methods', process.env.ACCESS_CONTROL_ALLOW_METHODS);
    res.setHeader('Access-Control-Allow-Headers', process.env.ACCESS_CONTROL_ALLOW_HEADERS);
    next();
})

app.use('/product', productRouters)
app.use('/user', userRouters)
app.use('/order', orderRouters)
app.use('/payment', paymentRouters)

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