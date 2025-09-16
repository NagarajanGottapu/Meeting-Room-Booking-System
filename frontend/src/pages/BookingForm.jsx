import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { format, addMinutes, parseISO, isAfter, isBefore, differenceInMinutes } from 'date-fns';
import { useAuthContext } from '../context/AuthContext';
import { useRooms } from '../hooks/useRooms';
import { useBookings } from '../hooks/useBookings';
import Layout from '../components/Layout';

const BookingForm = () => {
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preselectedRoomId = searchParams.get('roomId');
  
  const { rooms, loading: roomsLoading } = useRooms();
  const { createBooking, loading: bookingLoading } = useBookings();
  
  const [formData, setFormData] = useState({
    roomId: preselectedRoomId || '',
    title: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    startTime: '09:00',
    endTime: '10:00',
    attendeeCount: 1,
    requiredEquipment: []
  });
  
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [equipmentOptions, setEquipmentOptions] = useState([]);
  
  useEffect(() => {
    if (rooms.length > 0 && formData.roomId) {
      const room = rooms.find(r => r._id === formData.roomId);
      setSelectedRoom(room);
      if (room) {
        setEquipmentOptions(room.equipment);
      }
    }
  }, [rooms, formData.roomId]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleEquipmentChange = (equipment) => {
    setFormData(prev => {
      const updatedEquipment = prev.requiredEquipment.includes(equipment)
        ? prev.requiredEquipment.filter(item => item !== equipment)
        : [...prev.requiredEquipment, equipment];
      return { ...prev, requiredEquipment: updatedEquipment };
    });
  };
  
  const validateBooking = () => {
    // Create Date objects for start and end times
    const startDateTime = new Date(`${formData.date}T${formData.startTime}`);
    const endDateTime = new Date(`${formData.date}T${formData.endTime}`);
    const now = new Date();
    
    // Check if booking is in the past
    if (isBefore(startDateTime, now)) {
      toast.error('Cannot book for past time slots');
      return false;
    }
    
    // Check if end time is after start time
    if (!isAfter(endDateTime, startDateTime)) {
      toast.error('End time must be after start time');
      return false;
    }
    
    // Check minimum and maximum duration
    const durationMinutes = differenceInMinutes(endDateTime, startDateTime);
    if (durationMinutes < 30) {
      toast.error('Booking must be at least 30 minutes');
      return false;
    }
    if (durationMinutes > 240) {
      toast.error('Booking cannot exceed 4 hours');
      return false;
    }
    
    // Check business hours (9 AM to 6 PM)
    const startHour = startDateTime.getHours();
    const endHour = endDateTime.getHours();
    const endMinutes = endDateTime.getMinutes();
    
    if (startHour < 9 || (endHour > 18 || (endHour === 18 && endMinutes > 0))) {
      toast.error('Bookings are only allowed between 9 AM and 6 PM');
      return false;
    }
    
    // Check if booking is for current day only
    const today = new Date();
    if (today.toDateString() !== startDateTime.toDateString()) {
      toast.error('Bookings are only allowed for the current day');
      return false;
    }
    
    // Check room capacity
    if (selectedRoom && parseInt(formData.attendeeCount) > selectedRoom.capacity) {
      toast.error(`Room capacity (${selectedRoom.capacity}) exceeded`);
      return false;
    }
    
    return true;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateBooking()) {
      return;
    }
    
    try {
      // Format dates for API
      const startDateTime = new Date(`${formData.date}T${formData.startTime}`);
      const endDateTime = new Date(`${formData.date}T${formData.endTime}`);
      
      const bookingData = {
        userId: user._id,
        roomId: formData.roomId,
        title: formData.title,
        date: formData.date, // Explicitly added date field
        startTime: startDateTime.toISOString(),
        endTime: endDateTime.toISOString(),
        attendeeCount: parseInt(formData.attendeeCount),
        requiredEquipment: formData.requiredEquipment
      };
      
      await createBooking(bookingData);
      toast.success('Booking created successfully!');
      navigate('/my-bookings');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create booking');
    }
  };
  
  if (roomsLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="py-6">
        <div className="mb-6">
          <Link to="/rooms" className="text-blue-600 hover:text-blue-800">
            ← Back to Rooms
          </Link>
        </div>
        
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold mb-6">Book a Meeting Room</h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Room
                </label>
                <select
                  name="roomId"
                  value={formData.roomId}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select a room</option>
                  {rooms.map(room => (
                    <option key={room._id} value={room._id}>
                      {room.name} (Capacity: {room.capacity})
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Meeting Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter meeting title"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Attendees
                </label>
                <input
                  type="number"
                  name="attendeeCount"
                  value={formData.attendeeCount}
                  onChange={handleChange}
                  min="1"
                  max={selectedRoom?.capacity || 100}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Time
                </label>
                <input
                  type="time"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleChange}
                  min="09:00"
                  max="18:00"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Time
                </label>
                <input
                  type="time"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleChange}
                  min="09:30"
                  max="18:00"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
            
            {selectedRoom && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Required Equipment
                </label>
                <div className="flex flex-wrap gap-3">
                  {equipmentOptions.map((equipment, index) => (
                    <div key={index} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`equipment-${index}`}
                        checked={formData.requiredEquipment.includes(equipment)}
                        onChange={() => handleEquipmentChange(equipment)}
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <label htmlFor={`equipment-${index}`} className="ml-2 text-gray-700">
                        {equipment}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="flex justify-end">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={bookingLoading}
                className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-300"
              >
                {bookingLoading ? 'Creating Booking...' : 'Book Room'}
              </motion.button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default BookingForm;