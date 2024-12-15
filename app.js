const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const stockRoutes = require('./routes/stockRoutes');
const orderRoutes = require('./routes/orderRoutes');

const app = express();
dotenv.config();
connectDB();

app.use(cors());
app.use(express.json());

//middleware
app.use('/api/auth', authRoutes);
app.use('/api/stock', stockRoutes);
app.use('api/order', orderRoutes);


//server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`)
});
