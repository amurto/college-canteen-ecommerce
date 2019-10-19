const express = require('express');
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
const Product = require('../models/product');
const Cart = require('../models/cart');
const Order = require('../models/order');
const {initPayment, responsePayment} = require("../paytm/services/index");


// Welcome Page
router.get('/', forwardAuthenticated, (req, res) => res.render('welcome', { layout: false }));

router.get('/admin', forwardAuthenticated, (req, res) => res.render('admin-welcome', { layout: 'layout1' }));

router.get('/dashboard', ensureAuthenticated, function(req, res) {
  Product.find(function(err, docs) {
    if (err) throw err;
    res.render('dashboard', {
      user: req.user,
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
    res.render('dashboard', {
      user: req.user,
      products: docs
    });
  });
});

router.get('/add-to-cart/:id', ensureAuthenticated, function(req, res, next) {
  let productId = req.params.id;
  let cart = new Cart(req.session.cart ? req.session.cart : {});
  Product.findById(productId, function(err, product) {
    if (err) {
        return req.redirect('/');
    }
      cart.add(product, product.id);
      req.session.cart = cart;
      console.log(req.session.cart);
      res.redirect('/');
  });
});

router.get('/add-order-to-cart/:id', ensureAuthenticated, function(req, res, next) {
  let OrderId = req.params.id;
  Order.findOne({ 'OrderId': OrderId }, function(err, order) {
    req.session.cart = order.cart;
    res.redirect('/shopping-cart');
  });  
});

router.get('/shopping-cart', ensureAuthenticated, function(req, res, next) {
  if (!req.session.cart) {
      return res.render('shopping-cart', {
        products: null
      });
  }
  console.log(req.session.cart);
  let cart = new Cart(req.session.cart);
  res.render('shopping-cart', {products: cart.generateArray(), totalPrice: cart.totalPrice});
});

router.get('/pay', ensureAuthenticated, function(req, res) {
  if (!req.session.cart) {
    return res.render('shopping-cart', {
      products: null
    });
  }
  let cart = new Cart(req.session.cart);
  res.render('pay', {totalPrice: cart.totalPrice});
})

//paytm
router.get('/paywithpaytm', ensureAuthenticated, (req, res) => {
  if (!req.session.cart) {
    return res.redirect('/shopping-cart');
  }
  roomno = req.query.roomno;
  initPayment(req.session.cart.totalPrice).then(
      success => {
          res.render('paytmRedirect', {
              layout: false,
              resultData: success,
              paytmFinalUrl: process.env.PAYTM_FINAL_URL
          });
      },
      error => {
          res.send(error);
      }
  );
});

router.post('/paywithpaytmresponse', ensureAuthenticated, (req, res) => {
  responsePayment(req.body).then(
      success => {
          let order = new Order({
            user: req.user,
            cart: req.session.cart,
            Roomno: roomno,
            OrderId: req.body.ORDERID,
            order_date: req.body.TXNDATE,
            status: "ordered"
          });
          console.log(order);
          order.save(function(err, result) {
            req.session.cart = null;
            res.render('response', {layout: false, resultData: "true", responseData: success});
          });
      },
      error => {
          res.send(error);
      }
  );
});

module.exports = router;