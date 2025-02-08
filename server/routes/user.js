const express = require('express');
const router = express.Router();  

router.get("/", (req, res) => { 
    res.send('GET request to the user path');
});

module.exports = router;