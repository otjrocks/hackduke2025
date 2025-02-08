const express = require('express');
const router = express.Router();  
const User = require('../models/user'); 
const Product = require('../models/product');
const Theme = require('../models/theme');
const isImageURL = require('image-url-validator').default;
const checkAuthentication = require('../authMiddleware');

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

router.post("/add", checkAuthentication, (req, res) => {
    console.log(req.body);
    // async function updateProduct(req, res) {  // first try to find the product if it already exists and update it, otherwise create new product entry
    //     try {
    //       const isImage = await isImageURL(req.body.image);
    //       if (!isImage) {
    //         req.body.image = ''
    //       }
    //       const product = await Product.findOneAndUpdate(
    //         { email: req.user.email, name: req.body.name, size: req.body.size }, 
    //         { $set: { email: email, name: req.body.name, theme: req.body.theme, size: req.body.size, image: req.body.image, price: req.body.price, isSold: req.body.isSold, createdAt: req.body.createdAt } },
    //         { new: true, upsert: true } // upsert will create a new product if it does not exist
    //       );
    //       res.json({ success: true, authenticated: true, product: product });
    //     } catch (err) {
    //       console.log(err);
    //       res.json({ success: false, authenticated: false, message: "Unable to add product. Please try again." });
    //     }
    // }
    // updateProduct(req, res);
})

module.exports = router;