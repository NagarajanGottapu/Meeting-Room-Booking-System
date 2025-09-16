import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { format, isPast } from 'date-fns';
import toast from 'react-hot-toast';
import { useAuthContext } from '../context/AuthContext';
import { useBookings } from '../hooks/useBookings';
import Layout from '../components/Layout';

const MyBookings = () => {
  const { user } = useAuthContext();
  const { 
    userBookings, 
    loading, 
    error, 
    fetchUserBookings, 
    cancelBooking 
  } = useBookings();
  
  const [activeTab, setActiveTab] = useState('upcoming');
  
  useEffect(() => {
    if (user) {
      fetchUserBookings(user._id);
    }
  }, [user, fetchUserBookings]);
  
  const handleCancelBooking = async (bookingId, userId) => {
    try {
      await cancelBooking(bookingId, userId);
      toast.success('Booking cancelled successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to cancel booking');
    }
  };
  
  const upcomingBookings = userBookings.filter(
    booking => !isPast(new Date(booking.endTime))
  );
  
  const pastBookings = userBookings.filter(
    booking => isPast(new Date(booking.endTime))
  );
  
  if (loading) {
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
        <h1 className="text-2xl font-bold mb-6">My Bookings</h1>
        
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('upcoming')}
                className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'upcoming'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Upcoming Bookings
              </button>
              <button
                onClick={() => setActiveTab('past')}
                className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'past'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Past Bookings
              </button>
            </nav>
          </div>
        </div>
        
        {activeTab === 'upcoming' && (
          <>
            {upcomingBookings.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {upcomingBookings.map(booking => (
                  <motion.div
                    key={booking._id}
                    whileHover={{ y: -5 }}
                    className="bg-white rounded-lg shadow-md overflow-hidden"
                  >
                    <div className="p-6">
                      <h2 className="text-xl font-semibold mb-2">{booking.title}</h2>
                      <p className="text-gray-600 mb-4">
                        {booking.roomName}
                      </p>
                      
                      <div className="mb-4">
                        <p className="text-gray-700">
                          <span className="font-medium">Date:</span>{' '}
                          {format(new Date(booking.date), 'EEEE, MMMM d, yyyy')}
                        </p>
                        <p className="text-gray-700">
                          <span className="font-medium">Time:</span>{' '}
                          {format(new Date(booking.startTime), 'h:mm a')} - {format(new Date(booking.endTime), 'h:mm a')}
                        </p>
                        <p className="text-gray-700">
                          <span className="font-medium">Attendees:</span> {booking.attendeeCount}
                        </p>
                      </div>
                      
                      {booking.requiredEquipment.length > 0 && (
                        <div className="mb-4">
                          <h3 className="text-sm font-medium text-gray-700 mb-1">Equipment:</h3>
                          <div className="flex flex-wrap gap-2">
                            {booking.requiredEquipment.map((item, index) => (
                              <span 
                                key={index}
                                className="bg-blue-50 text-blue-600 text-xs px-2 py-1 rounded"
                              >
                                {item}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      <div className="flex justify-end">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleCancelBooking(booking._id, user._id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Cancel Booking
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 mb-4">You don't have any upcoming bookings.</p>
                <Link
                  to="/rooms"
                  className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Browse Rooms
                </Link>
              </div>
            )}
          </>
        )}
        
        {activeTab === 'past' && (
          <>
            {pastBookings.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pastBookings.map(booking => (
                  <div
                    key={booking._id}
                    className="bg-white rounded-lg shadow-md overflow-hidden opacity-75"
                  >
                    <div className="p-6">
                      <h2 className="text-xl font-semibold mb-2">{booking.title}</h2>
                      <p className="text-gray-600 mb-4">
                        {booking.roomName}
                      </p>
                      
                      <div className="mb-4">
                        <p className="text-gray-700">
                          <span className="font-medium">Date:</span>{' '}
                          {format(new Date(booking.date), 'EEEE, MMMM d, yyyy')}
                        </p>
                        <p className="text-gray-700">
                          <span className="font-medium">Time:</span>{' '}
                          {format(new Date(booking.startTime), 'h:mm a')} - {format(new Date(booking.endTime), 'h:mm a')}
                        </p>
                        <p className="text-gray-700">
                          <span className="font-medium">Attendees:</span> {booking.attendeeCount}
                        </p>
                      </div>
                      
                      {booking.requiredEquipment.length > 0 && (
                        <div className="mb-4">
                          <h3 className="text-sm font-medium text-gray-700 mb-1">Equipment:</h3>
                          <div className="flex flex-wrap gap-2">
                            {booking.requiredEquipment.map((item, index) => (
                              <span 
                                key={index}
                                className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded"
                              >
                                {item}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      <div className="flex justify-end">
                        <span className="text-gray-500 text-sm">
                          Completed
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">You don't have any past bookings.</p>
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
};

export default MyBookings;