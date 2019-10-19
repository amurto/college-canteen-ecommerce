const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
// Load User model
const User = require('../models/User');
const Cart = require('../models/cart');
const Order = require('../models/order');
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');

// Login Page
// router.get('/login', forwardAuthenticated, (req, res) => res.render('login', { layout: 'layout1' }));
router.get('/login', forwardAuthenticated, (req, res) => res.render('login', { layout: false }));

// Register Page
// router.get('/register', forwardAuthenticated, (req, res) => res.render('register', { layout: 'layout1' }));
router.get('/register', forwardAuthenticated, (req, res) => res.render('register', { layout: false }));

// Orders Page
router.get('/orders', ensureAuthenticated, (req, res) => {
        Order.find({user: req.user}, function(err, orders) {
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
          res.render('orders', { 
            orders: orders 
          });
        });
});

// Register
router.post('/register', (req, res) => {
  console.log(req.body);
  const { name, email, password, password2, collapse, rollno } = req.body;
  let errors = [];

  if (!name || !email || !password || !password2) {
    errors.push({ msg: 'Please enter all fields' });
  }

  if (password != password2) {
    errors.push({ msg: 'Passwords do not match' });
  }

  if (password.length < 6) {
    errors.push({ msg: 'Password must be at least 6 characters' });
  }

  if (errors.length > 0) {
    res.render('register',
     {
      layout: false,
      errors,
      name,
      email,
      password,
      password2
    });
  } else {
    User.findOne({ email: email }).then(user => {
      if (user) {
        errors.push({ msg: 'Email already exists' });
        res.render('register',
        {
          layout: false,
          errors,
          name,
          email,
          password,
          password2
        });
      } else {
        const newUser = new User({
          name,
          email,
          password
        });

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then(user => {
                req.flash(
                  'success_msg',
                  'You are now registered and can log in'
                );
                res.redirect('/users/login');
              })
              .catch(err => console.log(err));
          });
        });
      }
    });
  }
});

// Login
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
});

// Logout
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/users/login');
});

module.exports = router;