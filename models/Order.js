const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    userName: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    productName: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Stock',
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    totalPrice: {
        type: Number,
        required: true
    },
    status: { // Status of the order
        type: String,
        default: 'Pending'
    }
});

module.exports = mongoose.model('Order', orderSchema);
