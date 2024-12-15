const express = require('express');
const {placeOrder, getOrder} = require('../controllers/orderController');
const router = express.Router();

router.post('/place', placeOrder);

router.get('/get', getOrder);

module.exports = router;