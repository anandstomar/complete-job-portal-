const Razorpay = require('razorpay');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_oslaXVtc8B1CNq',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'Yda1AaJsd2DGXae88zn9kBYu',
});

module.exports = {
  createOrder: ({ amount, currency = 'INR', receipt }) =>
    razorpay.orders.create({ amount: amount * 100, currency, receipt }),

  fetchPayment: paymentId =>
    razorpay.payments.fetch(paymentId),
};
