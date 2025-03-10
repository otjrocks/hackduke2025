const express = require('express');
const router = express.Router();  
const User = require('../models/user'); 
const Product = require('../models/product');
const Theme = require('../models/theme');
const isImageURL = require('image-url-validator').default;
const passport = require('passport');
const checkAuthentication = require('../authMiddleware');

router.get("/get/email/:email", async (req, res) => {
    try {
        const userEmail = req.params.email;

        // Find products associated with the given email
        const products = await Product.find({ email: userEmail });
        if (!products || products.length === 0) {
            return res.json({ success: false, message: "No products found for this email." });
        }

        res.json({ success: true, products });
    } catch (err) {
        console.error(err);
        res.json({ success: false, message: "Unable to retrieve products." });
    }
});


router.get("/get/:theme", (req, res) => { 
    Theme.findOne({name: req.params.theme })
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

router.delete("/delete/:_id", checkAuthentication, async(req, res)=>{
    try {
        const { _id } = req.params;
        const product = await Product.findById(_id); // Await the database query

        if (!product) {
            return res.json({ success: false, message: "Product not found" });
        }

        if (product.email !== req.user.email) {
            return res.json({ success: false, message: "Unauthorized" });
        }
        // Proceed with deletion if authorized
        await Product.findByIdAndDelete(_id);
        res.json({ success: true, message: "Product deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error deleting product" });
    }
});


router.post("/add", checkAuthentication, async (req, res) => {
    try {
        // Lookup theme by name (using Theme schema)
        let theme = await Theme.findOne({ name: req.body.theme });
        
        // If theme doesn't exist, create it
        if (!theme) {
            theme = new Theme({
                name: req.body.theme
            });

            // Save the new theme to the database
            await theme.save();
        }

        // Create or update product
        const product = await Product.findOneAndUpdate(
            { email: req.user.email, name: req.body.name, size: req.body.size }, 
            {
                $set: {
                    email: req.user.email, 
                    name: req.body.name, 
                    theme: theme._id,  // Use theme._id instead of req.body.theme
                    size: req.body.size, 
                    image: req.body.image, 
                    price: req.body.price, 
                    isSold: req.body.isSold, 
                    createdAt: req.body.createdAt 
                }
            },
            { new: true, upsert: true } // upsert will create a new product if it does not exist
        );
        
        res.json({ success: true, authenticated: true, product: product });
    } catch (err) {
        res.json({ success: false, authenticated: false, message: "Unable to add product. Please try again." });
    }
});



module.exports = router;