const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const errorHandler = require('./middleware/errorHandler');
 
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const roomRoutes = require('./routes/roomRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
 
dotenv.config();
 
const app = express();
 
//middleware
app.use(cors());
app.use(express.json())
app.use(express.urlencoded({ extended: false }));
 
//routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/bookings', bookingRoutes);
 
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Meeting Room Booking API' });
});
 
// Error handler middleware
app.use(errorHandler);
 
module.exports = app;