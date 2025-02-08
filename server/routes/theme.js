const express = require('express');
const router = express.Router();  
const Theme = require('../models/theme');

// GET method to fetch all themes
router.get('/themes', async (req, res) => {
    try {
        const themes = await Theme.find(); // Fetch all themes
        res.json(themes); // Send response with themes as JSON
    } catch (err) {
        res.status(500).json({ message: err.message }); // Handle error
    }
});


module.exports = router;
