const Room = require('../models/Room');
 
exports.getAllRooms = async (filters = {}) => {
  try {
    const query = { ...filters };
    if (!query.isActive) {
      query.isActive = true; // Default to active rooms
    }
 
    const rooms = await Room.find(query);
    return rooms;
  } catch (error) {
    throw new Error(`Error retrieving rooms: ${error.message}`);
  }
};
 
exports.getRoomById = async (id) => {
  try {
    const room = await Room.findById(id);
    return room;
  } catch (error) {
    throw new Error(`Error finding room: ${error.message}`);
  }
};
 
exports.createRoom = async (roomData) => {
  try {
    const room = new Room(roomData);
    await room.save();
    return room;
  } catch (error) {
    throw new Error(`Error creating room: ${error.message}`);
  }
};
 
exports.updateRoom = async (id, roomData) => {
  try {
    const room = await Room.findByIdAndUpdate(id, roomData, { new: true });
    return room;
  } catch (error) {
    throw new Error(`Error updating room: ${error.message}`);
  }
};