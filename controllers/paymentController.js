const paypal = require('paypal-rest-sdk');

exports.createPayment = (req, res) => {
    paypal.configure({
        'mode': 'sandbox',
        'client_id': process.env.CLIENT_ID,
        'client_secret': process.env.CLIENT_SECRET
    });

    var { cartItems, total, userId } = req.body
    console.log(cartItems)

    var create_payment_json = {
        intent: "authorize",
        payer: {
            payment_method: "paypal"
        },
        redirect_urls: {
            return_url: process.env.REACT_BASE_URL + `paymentSuccess`,
            cancel_url: process.env.REACT_BASE_URL +  `paymentCancel`
        },
        transactions: [{
            item_list: {
                items: cartItems.map(item => ({
                    name: item.name,
                    sku: item.name,
                    price: item.price / 20000,
                    currency: "USD",
                    quantity: item.quantity
                }))
            },
            amount: {
                currency: "USD",
                total: total / 20000
            },
            description: "Payment for user: " + userId
        }]
    };


    paypal.payment.create(create_payment_json, function (error, payment) {
        if (error) {
            console.log(error);
            return res.status(500).json({ error: 'Could not create PayPal payment' });
        } else {
            for (let index = 0; index < payment.links.length; index++) {
                if (payment.links[index].rel === 'approval_url') {
                    console.log(payment)
                    return res.status(201).json({ data: (payment.links[index].href) })
                }
            }
            return res.status(500).json({ error: 'No approval_url found in PayPal response' });
        }
    });
};

exports.paymentSuccess = (req, res) => {

    const paymentId = req.query.paymentId;
    const payerId = req.query.PayerId;

    var execute_payment_json = {
        "payer_id": payerId
    };

    paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
        if (error) {
            console.log(error.response);
            throw error;
        } else {
            return res.status(201).json({ payment })
        }
    });
}