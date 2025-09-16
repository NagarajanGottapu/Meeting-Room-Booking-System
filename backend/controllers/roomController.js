const roomService = require('../services/roomService');
 
// Get all rooms
exports.getAllRooms = async (req, res) => {
  try {
    const rooms = await roomService.getAllRooms();
    res.status(200).json(rooms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
 
// Get a single room by ID
exports.getRoomById = async (req, res) => {
  try {
    const { id } = req.params;
    const room = await roomService.getRoomById(id);
 
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
 
    res.status(200).json(room);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
 
// Create a new room
exports.createRoom = async (req, res) => {
  try {
    const { name, capacity, equipment, location } = req.body;
 
    if (!name || !capacity) {
      return res.status(400).json({ message: 'Room name and capacity are required' });
    }
 
    const room = await roomService.createRoom({
      name,
      capacity,
      equipment: equipment || [],
      location: location || ''
    });
 
    res.status(201).json(room);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
 
// Update a room
exports.updateRoom = async (req, res) => {
  try {
    const { id } = req.params;
    const roomData = req.body;
 
    const room = await roomService.updateRoom(id, roomData);
 
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
 
    res.status(200).json(room);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
