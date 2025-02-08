const express = require('express');
const router = express.Router();  
const User = require('../models/user'); 
const jwt = require('jsonwebtoken');
const Product = require('../models/product');
const Theme = require('../models/theme');
//const theme = require('../models/theme');
//const product = require('../models/product');
const isImageURL = require('image-url-validator').default;

router.get("/get/:theme", (req, res) => { 
    Theme.findOne({theme: req.params.theme })
    .then((theme) => {
        Product.find({theme: theme})
        .then((products) => {
            res.json({success: true, products: products, message: "Success"});
        })
        .catch((err) => {
            res.json({success: false, message: "Unable to retrieve products"});
            console.log(err);
        });
    })
    .catch((err) => {
        res.json({success: false, authenticated: false, message: "Invalid theme name."})
        console.log(err);
    })
});

router.post("/add", (req, res) => {
    async function updateProduct(req, res, user) {  // first try to find the product if it already exists and update it, otherwise create new product entry
        try {
          const isImage = await isImageURL(req.body.image);
          if (!isImage) {
            req.body.image = ''
          }
          const product = await Product.findOneAndUpdate(
            { user_id: user._id, name: req.body.name, size: req.body.size }, 
            { $set: { user_id: user._id, name: req.body.name, category: req.body.category, size: req.body.size, image: req.body.image, price: req.body.price, isSold: req.body.isSold, createdAt: req.body.createdAt } },
            { new: true, upsert: true } // upsert will create a new product if it does not exist
          );
          res.json({ success: true, authenticated: true, product: product });
        } catch (err) {
          res.json({ success: false, authenticated: false, message: "Unable to add product. Please try again." });
        }
    }

    const token = req?.cookies?.token
    if (!token) {
        res.json({ success: false, message: "Unauthorized"})
    } else {
        decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        User.findOne({_id: decoded.userId })
            .then((user) => {
                updateProduct(req, res, user);
            })
            .catch((err) => {
                res.json({success: false, authenticated: false, message: "Invalid user token."})
                console.log(err);
            });
    }
})

module.exports = router;