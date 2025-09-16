const mongoose = require('mongoose');
 
const bookingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  userName: {
    type: String,
    required: true
  },
  userEmail: {
    type: String,
    required: true
  },
  roomId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
    required: true
  },
  roomName: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: [true, 'Meeting title is required']
  },
  date: {
    type: Date,
    required: true
  },
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date,
    required: true
  },
  duration: {
    type: Number,
    required: true,
    min: 30,  // Minimum 30 minutes
    max: 240  // Maximum 4 hours
  },
  attendeeCount: {
    type: Number,
    required: true,
    min: 1
  },
  requiredEquipment: {
    type: [String],
    default: []
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['active', 'cancelled'],
    default: 'active'
  }
});
 

 
module.exports = mongoose.model('Booking', bookingSchema);