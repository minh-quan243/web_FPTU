const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();


// MIDDLEWARE
app.use(cors());
app.use(express.json());


// DATABASE
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));


// ROUTES
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');

app.use(authRoutes);
app.use(productRoutes);
app.use('/orders', orderRoutes);
app.use('/uploads',
  express.static('uploads')
);

// SERVER
app.listen(5000, () => {
  console.log('Server running on port 5000');
});