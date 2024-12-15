const mongoose = require('mongoose');

const stockSchema = new mongoose.Schema({
    product:{
        type: String,
        required: true
    },
    quantity:{
        type: Number,
        required: true
    },
    price_per_piece:{
        type: Number,
        required: true
    }
});

module.exports = mongoose.model("Stock", stockSchema);