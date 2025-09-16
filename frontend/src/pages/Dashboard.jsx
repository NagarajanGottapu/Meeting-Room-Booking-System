import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { useAuthContext } from '../context/AuthContext';
import { useRooms } from '../hooks/useRooms';
import { useBookings } from '../hooks/useBookings';
import Layout from '../components/Layout';

const Dashboard = () => {
  const { user } = useAuthContext();
  const { rooms, loading: roomsLoading } = useRooms();
  const { userBookings, loading: bookingsLoading, error, fetchUserBookings } = useBookings();
  const [currentDate] = useState(new Date());
  const [timeSlots] = useState(generateTimeSlots());
  
  // Generate time slots from 9 AM to 6 PM
  function generateTimeSlots() {
    const slots = [];
    for (let hour = 9; hour <= 18; hour++) {
      const formattedHour = hour > 12 ? `${hour - 12} PM` : hour === 12 ? '12 PM' : `${hour} AM`;
      slots.push({ hour, label: formattedHour });
    }
    return slots;
  }
  
  useEffect(() => {
    if (user) {
      fetchUserBookings(user._id);
    }
  }, [user, fetchUserBookings]);
  
  if (roomsLoading || bookingsLoading) {
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
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold mb-2">Welcome, {user?.name}</h1>
            <p className="text-gray-600">
              {format(currentDate, 'EEEE, MMMM d, yyyy')}
            </p>
          </div>
          
          <Link
            to="/book"
            className="mt-4 md:mt-0 bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Book a Room
          </Link>
        </div>
        
        {/* Upcoming bookings section */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold mb-4">Your Upcoming Bookings</h2>
          
          {userBookings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {userBookings
                .filter(booking => new Date(booking.startTime) > new Date())
                .sort((a, b) => new Date(a.startTime) - new Date(b.startTime))
                .slice(0, 3)
                .map(booking => (
                  <motion.div
                    key={booking._id}
                    whileHover={{ y: -3 }}
                    className="bg-white rounded-lg shadow-md p-4 border-l-4 border-blue-500"
                  >
                    <h3 className="font-medium text-lg">{booking.title}</h3>
                    <p className="text-gray-600 text-sm mb-2">{booking.roomName}</p>
                    <p className="text-gray-700">
                      {format(new Date(booking.startTime), 'h:mm a')} - {format(new Date(booking.endTime), 'h:mm a')}
                    </p>
                    <p className="text-gray-600 text-sm mt-2">
                      Attendees: {booking.attendeeCount}
                    </p>
                  </motion.div>
                ))}
            </div>
          ) : (
            <p className="text-gray-500">You don't have any upcoming bookings.</p>
          )}
          
          {userBookings.length > 0 && (
            <div className="mt-4">
              <Link to="/my-bookings" className="text-blue-600 hover:text-blue-800">
                View all bookings →
              </Link>
            </div>
          )}
        </div>
        
        {/* Room availability timeline */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Room Availability Today</h2>
          
          <div className="overflow-x-auto">
            <div className="min-w-max">
              <div className="grid grid-cols-[200px_repeat(10,100px)] bg-gray-100 py-2">
                <div className="px-4 font-medium">Room</div>
                {timeSlots.map(slot => (
                  <div key={slot.hour} className="text-center text-sm font-medium">
                    {slot.label}
                  </div>
                ))}
              </div>
              
              {rooms.map(room => (
                <div 
                  key={room._id} 
                  className="grid grid-cols-[200px_repeat(10,100px)] border-b py-2"
                >
                  <div className="px-4 font-medium flex items-center">{room.name}</div>
                  {timeSlots.map(slot => (
                    <div 
                      key={slot.hour} 
                      className="flex justify-center items-center"
                    >
                      <div className="w-full h-6 bg-green-100 mx-1 rounded"></div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
          
          <div className="mt-4">
            <Link to="/rooms" className="text-blue-600 hover:text-blue-800">
              View all rooms →
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;