import api from './config';

export const roomApi = {
  getAllRooms: async () => {
    const response = await api.get('/rooms');
    return response.data;
  },
  
  getRoomById: async (roomId) => {
    const response = await api.get(`/rooms/${roomId}`);
    return response.data;
  },
  
  // Updated to use the existing booking endpoint
  getRoomAvailability: async (roomId, date) => {
    const response = await api.get(`/bookings/room/${roomId}`, {
      params: { date }
    });
    return response.data;
  }
};