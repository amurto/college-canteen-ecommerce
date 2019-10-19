const express = require('express');
const router = express.Router();
var multer = require('multer');
var path = require('path');
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
const Product = require('../models/product');
const Cart = require('../models/cart');
const Order = require('../models/order');
var product = Product.find({});

var Storage = multer.diskStorage({
  destination: "../public/edited-images/",
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname));
  }
});

var upload = multer({
  storage: Storage
}).single('file');

router.post('/confirm-product', upload, function (req, res, next) {
  var newProduct = new Product({
      title: req.body.title,
      description: req.body.description,
      category: req.body.category,
      foodtype: req.body.foodtype,
      price: req.body.price,
      imagePath: "/edited-images/"+req.file.filename
  });

  newProduct.save(function (err, req) {
    if (err) throw err;
    product.exec(function (err, data) {
      if (err) throw err;
      res.redirect('/dashboard');
    });
  })
});

/*delete the entry from the table*/
router.get('/delete/:id', function (req, res, next) {
  var id = req.params.id;
  var del = Product.findByIdAndDelete(id);

  del.exec(function (err) {
    if (err) throw err;
    product.exec(function (err, data) {
      if (err) throw err;
      res.redirect('/edit-products');
    });
  });
});

router.post('/update/', upload, function (req, res, next) {

  if (req.file) {

    var dataRecords = {
      title: req.body.title,
      description: req.body.description,
      category: req.body.category,
      foodtype: req.body.foodtype,
      price: req.body.price,
      imagePath: "/edited-images/"+req.file.filename
    }
  } else {

    var dataRecords = {
      title: req.body.title,
      description: req.body.description,
      category: req.body.category,
      foodtype: req.body.foodtype,
      price: req.body.price
    }
  }
  var update = Product.findByIdAndUpdate(req.body.id, dataRecords);
  update.exec(function (err, data) {
    if (err) throw err;
    product.exec(function (err, data) {
      if (err) throw err;
      res.redirect("/dashboard");
    });
  });

});

// Welcome Page
router.get('/', forwardAuthenticated, (req, res) => res.render('welcome', { layout: 'layout1' }));

router.get('/dashboard', ensureAuthenticated, function(req, res) {
  Product.find(function(err, docs) {
    if (err) throw err;
    res.render('dashboard', {
      admin: req.admin,
      products: docs
    });
  });
});

router.get('/orders-status', ensureAuthenticated, (req, res) => {
  Order.find(function(err, orders) {
    if (err) {
      return res.write('Error');
    }
    orders.forEach(function(order) {
        let cart = new Cart(order.cart);
        order.items = cart.generateArray();
    });
    if(orders.length == 0) {
      console.log("null");
    }
    
    res.render('orders-status', { 
      orders: orders 
    });
  });
});

router.get('/change-status/:id', ensureAuthenticated, function(req, res, next) {
  let OrderId = req.params.id;
  let status = req.query.status;
  let myquery = { OrderId: OrderId };
  let newvalues;
  if(status == "delivered") {
    newvalues = {$set: {status: status, delivery_date: Date.now()} };
  }
  else {
    newvalues = {$set: {status: status} };
  }
  Order.updateOne(myquery, newvalues, function(err, res) {
    if (err) throw err;
  });   
  res.redirect('/orders-status'); 
});

router.get('/edit-products', ensureAuthenticated, function(req, res) {
  Product.find(function(err, docs) {
    if (err) throw err;
    res.render('products-page', {
      products: docs
    });
  });
});

router.get(['/snacks','/cold-drinks','/beverages','/desserts'], function(req,res) {
  var category = req.url;
  category = category.replace("/", "");
  category = category.replace("-"," ");
  Product.find({ 'category': category }, function(err, docs) {
    if (err) throw err;
    res.render('products-page', {
      products: docs
    });
  });
});

router.get('/add-products', ensureAuthenticated, function(req, res, next) {
  res.render('add-products', {
    layout: false
  });
});

router.get('/edit/:id', ensureAuthenticated, function(req, res, next) {
  let productId = req.params.id;
  Product.findById(productId, function(err, product) {
    if (err) {
        return req.redirect('/');
    }
    console.log(product);
      res.render('edit-products', {
        layout: false,
        product: product
      });
  });
});

module.exports = router;