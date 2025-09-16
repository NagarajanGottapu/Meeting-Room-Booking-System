const express = require('express');
const router = express.Router();
const roomController = require('../controllers/roomController');
 
// Get all rooms
router.get('/', roomController.getAllRooms);
 
// Get a single room by ID
router.get('/:id', roomController.getRoomById);
 
// Create a new room
router.post('/', roomController.createRoom);
 
// Update a room
router.put('/:id', roomController.updateRoom);
 
module.exports = router;