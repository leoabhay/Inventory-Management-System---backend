const Stock = require('../models/Stock');

exports.createStock = async (req,res) => {
    const {product, quantity, price_per_piece} = req.body;

    try{
        console.log('Create stock request received:', req.body);

        //create and save new stock
        const newStock = new Stock({product, quantity, price_per_piece});
        await newStock.save();
        res.status(201).json({message: 'Stock item created successfully', stock: newStock});

    }catch(err){
        console.error('Error creating stock', err)
        res.status(500).json({message : 'Internal server error'});
    }
}

exports.getStock = async (req,res) => {
    try{
        console.log('Get stock request received:', req.body);

        //find stock
        const stock = await Stock.find();
        res.json(stock);

    }catch(err){
        console.error('Error getting stock', err)
        res.status(500).json({message: 'Internal server error'});
    }
};