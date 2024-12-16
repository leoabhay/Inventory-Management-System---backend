const express = require('express');
const {getStock, createStock} = require('../controllers/stockController');
const router = express.Router();

router.post('/create', createStock)

router.get('/get', getStock);

module.exports = router;