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




const products = [
    new Product({
        imagePath: "/product-images/sprite1.25.jpg",
        title: "Sprite (1.25 Ltr)",
        description: "This will help you in summer!",
        price: 55,
        category: "cold drinks"
    }),
    new Product({
        imagePath: "/product-images/maaza1.5.jpg",
        title: "Maaza (1.5 Ltr)",
        description: "Taste the sweetness and freshness of mangoes in any season",
        price: 65,
        category: "cold drinks"
    }),
    new Product({
        imagePath: "/product-images/amulpistamalai.jpg",
        title: "Amul Kulfi - Pista Malai, 60ml",
        description: "Traditional Indian ice-cream at its best in Pista Malai flavorby Amul.",
        price: 30,
        category: "desserts"
    }),
    new Product({
        imagePath: "/product-images/unicornetto.jpg",
        title: "kwality walls Frozen Dessert - Uni Cornetto, 74 g",
        description: "With the first ever purple cone, Kwality wall's Uni Cornetto is a creamy berry dessert with praline sprinkles and a white chocolate disc which makes it just right to share a bite with your loved one.",
        price: 60,
        category: "desserts"
    }),
    new Product({
        imagePath: "/product-images/cavinslassi.jpg",
        title: "Cavins Rose Lassi, 200ml",
        description: "Lassi is an easy Indian Summer Drink made with yogurt and flavored with cardamom powder and rose essence.",
        price: 20,
        category: "beverages"
    }),
    new Product({
        imagePath: "/product-images/greentea.jpg",
        title: "Green Tea, 100ml",
        description: "Green tea is the healthiest beverage on the planet. It is loaded with antioxidants and nutrients that have powerful effects on the body.",
        price: 20,
        category: "beverages"
    })
];

let done = 0;
for (let i = 0; i < products.length; i++) {
    products[i].save(function(err, result) {
        done++;
        if (done == products.length) {
            exit();
        }
    });
}

function exit() {
    mongoose.disconnect();
}