const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  cart: {
    type: Object,
    required: true
  },
  Roomno: {
    type: String
  },
  status: {
    type: String
  },
  OrderId: {
    type: String,
    required: true
  },
  order_date: {
    type: Date,
    required: true
  },
  delivery_date: {
    type: Date
  }
});

const Order = mongoose.model('Order', OrderSchema);

module.exports = Order;