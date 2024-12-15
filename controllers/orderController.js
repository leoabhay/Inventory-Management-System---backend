const Stock = require('../models/Stock');
const Order = require('../models/Order');

//place order controller
exports.placeOrder = async (req,res) => {
    const{userId, productId, quantity} = req.body;

    try{
        console.log("Place order request received", req.body);
        const stock = await Stock.findById(productId);
        if(!stock || stock.quantity < quantity) { 
            return res.status(400).json({message: 'Insufficient stock'});
        };

        const totalPrice = stock.price_per_piece * quantity;

        const newOrder = new Order ({userId, productId, quantity, totalPrice, status: 'Placed'});
        await newOrder.save();

        stock.quantity -= quantity;
        await stock.save();

        res.status(201).json({message: 'Order placed successfully', order: newOrder});

    }catch(err){
        console.error('Error in placing order',err);
        res.status(500).json({message: 'Internal server error'});
    }
};

//get order controller
exports.getOrder = async (req,res) => {
    const {orderId} = req.query;

    try{
        console.log('Get order request received', req.query);

        const order = await Order.findById(orderId).populate('productId');
        if(!order) return res.status(404).json({message: 'Order not found'});
        res.status(200).json({message: 'Order not found'});

    }catch(err){
        console.error('Error getting order', err);
        res.status(500).json({message: 'Internal server error'});
    }
}