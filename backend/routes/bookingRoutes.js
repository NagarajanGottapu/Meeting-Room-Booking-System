const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { protect } = require('../middleware/authMiddleware');

// Create a new booking
router.post('/', protect, bookingController.createBooking);

// Get bookings for a user
router.get('/user/:userId', protect, bookingController.getUserBookings);

// Get bookings for a room
router.get('/room/:roomId', protect, bookingController.getRoomBookings);

// Get all bookings for a date
router.get('/', protect, bookingController.getAllBookingsForDate);

// Cancel a booking
router.put('/cancel/:id', protect, bookingController.cancelBooking);

module.exports = router;