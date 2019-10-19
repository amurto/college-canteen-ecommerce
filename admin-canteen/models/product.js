const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  imagePath: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  foodtype: {
    type: String
  },
  category: {
    type: String
  }
});

const product = mongoose.model('product', ProductSchema);

module.exports = product;