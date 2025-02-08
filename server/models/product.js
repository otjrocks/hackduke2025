const mongoose = require('mongoose'); 
const Schema = mongoose.Schema; 
  
const ProductSchema = new Schema({    
    user_id: {
        type: Schema.Types.ObjectId, 
        ref: 'User',
        required: true, 
    }, 
    image: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    size: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
    },
    createdAt: {
        type: Date,
        required: true,
    },
    isSold: {
        type: Boolean,
        required: true,
    }
}); 

module.exports = mongoose.model("Product", ProductSchema); 
