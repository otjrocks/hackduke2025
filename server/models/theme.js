const mongoose = require('mongoose'); 
const Schema = mongoose.Schema; 

const ThemeSchema = new Schema({    
    name: {
        type: String, 
        required: true, 
        unique: true
    }, 
}); 

module.exports = mongoose.model("Theme", ThemeSchema); 