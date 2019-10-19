const Product = require('../models/product');
const mongoose = require('mongoose');
const db = require('../config/keys').mongoURI;
mongoose
  .connect(
    db,
    { useNewUrlParser: true }  
  )
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));
// Product.find(function (err, products) {
//     if (err) return console.error(err);
//     const ok = products;
//     return ok;
// });
// const now = Product.find();
// console.log(now);
Product.find({ 'title': 'Chicken Burger' }, function(err, prod) {
  if (err) throw err;
  console.log(prod);
});
