import { useState, useEffect, useRef } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { useRooms } from '../hooks/useRooms';
import { useBookings } from '../hooks/useBookings';
import Layout from '../components/Layout';

const RoomDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);
  const [bookings, setBookings] = useState([]);
  const currentDateRef = useRef(new Date());
  const { getRoomById, loading, error } = useRooms();
  const { fetchRoomBookings } = useBookings();
  const [timeSlots] = useState(generateTimeSlots());
  
  // Generate time slots from 9 AM to 6 PM
  function generateTimeSlots() {
    const slots = [];
    for (let hour = 9; hour <= 18; hour++) {
      slots.push({ 
        hour, 
        label: hour > 12 ? `${hour - 12} PM` : hour === 12 ? '12 PM' : `${hour} AM` 
      });
    }
    return slots;
  }
  
  useEffect(() => {
    const loadRoomAndBookings = async () => {
      try {
        const roomData = await getRoomById(id);
        setRoom(roomData);
        
        // Format date for API
        const dateString = format(currentDateRef.current, 'yyyy-MM-dd');
        const bookingsData = await fetchRoomBookings(id, dateString);
        setBookings(bookingsData);
      } catch (err) {
        toast.error('Failed to load room details');
        console.error('Error loading room:', err);
      }
    };
    
    loadRoomAndBookings();
  }, [id, getRoomById, fetchRoomBookings]);
  
  const isTimeSlotBooked = (hour) => {
    if (!bookings.length) return false;
    
    const hourTime = new Date(currentDateRef.current);
    hourTime.setHours(hour, 0, 0, 0);
    
    return bookings.some(booking => {
      const startTime = new Date(booking.startTime);
      const endTime = new Date(booking.endTime);
      return hourTime >= startTime && hourTime < endTime;
    });
  };
  
  if (loading || !room) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </Layout>
    );
  }
  
  if (error) {
    return (
      <Layout>
        <div className="bg-red-50 text-red-600 p-4 rounded-md mb-4">
          {error}
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
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h1 className="text-2xl font-bold mb-4">{room.name}</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h2 className="text-lg font-semibold mb-2">Room Details</h2>
              <p className="mb-2">
                <span className="font-medium">Capacity:</span> {room.capacity} people
              </p>
              <p className="mb-2">
                <span className="font-medium">Location:</span> {room.location}
              </p>
              
              <h3 className="font-medium mt-4 mb-2">Equipment:</h3>
              <div className="flex flex-wrap gap-2">
                {room.equipment.map((item, index) => (
                  <span 
                    key={index}
                    className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-sm"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="flex flex-col justify-center items-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate(`/book?roomId=${room._id}`)}
                className="w-full md:w-48 bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 transition-colors"
              >
                Book This Room
              </motion.button>
            </div>
          </div>
          
          {/* Room availability timeline */}
          <div className="mt-8">
            <h2 className="text-lg font-semibold mb-4">Today's Availability</h2>
            <p className="text-gray-600 mb-4">
              {format(currentDateRef.current, 'EEEE, MMMM d, yyyy')}
            </p>
            
            <div className="overflow-x-auto">
              <div className="grid grid-cols-[100px_repeat(10,minmax(60px,1fr))] bg-gray-100 py-2 rounded-t-lg">
                <div className="px-4 font-medium">Time</div>
                {timeSlots.map(slot => (
                  <div key={slot.hour} className="text-center text-sm font-medium">
                    {slot.label}
                  </div>
                ))}
              </div>
              
              <div className="grid grid-cols-[100px_repeat(10,minmax(60px,1fr))] border-b py-3 rounded-b-lg bg-white">
                <div className="px-4 font-medium">Status</div>
                {timeSlots.map(slot => {
                  const isBooked = isTimeSlotBooked(slot.hour);
                  return (
                    <div 
                      key={slot.hour} 
                      className="flex justify-center items-center"
                    >
                      <div 
                        className={`w-full h-8 ${isBooked ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'} 
                          mx-1 rounded flex items-center justify-center text-xs font-medium`}
                      >
                        {isBooked ? 'Booked' : 'Available'}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          
          {/* Bookings for today */}
          {bookings.length > 0 && (
            <div className="mt-8">
              <h2 className="text-lg font-semibold mb-4">Today's Bookings</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {bookings.map(booking => (
                  <div 
                    key={booking._id} 
                    className="bg-gray-50 rounded-lg p-4 border-l-4 border-blue-500"
                  >
                    <h3 className="font-medium">{booking.title}</h3>
                    <p className="text-gray-600 text-sm mb-1">
                      {format(new Date(booking.startTime), 'h:mm a')} - {format(new Date(booking.endTime), 'h:mm a')}
                    </p>
                    <p className="text-gray-600 text-sm">
                      Booked by: {booking.userName}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default RoomDetail;