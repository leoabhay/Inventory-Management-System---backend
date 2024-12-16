const Stock = require('../models/Stock');
const {User} = require('../models/User');
const Order = require('../models/Order');

// Place Order controller
exports.placeOrder = async (req, res) => {
    const { userName, productName, quantity } = req.body;

    try {
        console.log("Place order request received:", req.body);

         // Check if all required fields are in the request body
         if (!userName || !productName || !quantity) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        // Find the user by name
        const user = await User.findOne({ name: userName });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Find the product by name
        const stock = await Stock.findOne({ product: productName });
        if (!stock || stock.quantity < quantity) {
            return res.status(400).json({ message: 'Insufficient stock or product not found' });
        }

        const totalPrice = stock.price_per_piece * quantity;

        // Create a new order
        const newOrder = new Order({
            userName: user._id, // Save the user's ObjectId
            productName: stock._id, // Save the product's ObjectId
            quantity,
            totalPrice,
            status: 'Placed'
        });
        await newOrder.save();

        stock.quantity -= quantity;
        await stock.save();

        res.status(201).json({ message: 'Order placed successfully', order: newOrder });
    } catch (err) {
        console.error('Error in placing order:', err);
        res.status(500).json({ message: 'Internal server error', error: err.message });
    }
};

//get order controller
exports.getOrder = async (req, res) => {
    let { orderId } = req.query;
    
    // Trim any leading or trailing spaces or newline characters
    orderId = orderId.trim();

    try {
        console.log('Get order request received:', req.query);

        const order = await Order.findById(orderId)
            .populate('userName', 'name') // Populate the user's name
            .populate('productName', 'product'); // Populate the product's name
            console.log('Populated Order:', order);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.status(200).json({ message: 'Order found', order });

    } catch (err) {
        console.error('Error getting order:', err);
        res.status(500).json({ message: 'Internal server error', error: err.message });
    }
};

