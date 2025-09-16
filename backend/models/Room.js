const mongoose = require('mongoose');
 
const roomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Room name is required'],
    unique: true
  },
  capacity: {
    type: Number,
    required: [true, 'Room capacity is required'],
    min: [1, 'Room capacity must be at least 1']
  },
  equipment: {
    type: [String],
    default: []
  },
  isActive: {
    type: Boolean,
    default: true
  },
  location: {
    type: String,
    default: ''
  }
});
 
 
module.exports = mongoose.model('Room', roomSchema);