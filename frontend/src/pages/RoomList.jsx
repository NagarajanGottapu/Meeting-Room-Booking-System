import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useRooms } from '../hooks/useRooms';
import Layout from '../components/Layout';

const RoomList = () => {
  const { rooms, loading, error } = useRooms();
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredRooms = rooms.filter(room => 
    room.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  if (loading) return (
    <Layout>
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    </Layout>
  );
  
  if (error) return (
    <Layout>
      <div className="bg-red-50 text-red-600 p-4 rounded-md mb-4">
        {error}
      </div>
    </Layout>
  );

  return (
    <Layout>
      <div className="py-6">
        <h1 className="text-2xl font-bold mb-6">Available Meeting Rooms</h1>
        
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search rooms..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-1/3 px-4 py-2 border border-gray-300 rounded-md"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRooms.map(room => (
            <motion.div
              key={room._id}
              whileHover={{ y: -5 }}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-2">{room.name}</h2>
                <p className="text-gray-600 mb-4">Capacity: {room.capacity} people</p>
                
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Equipment:</h3>
                  <div className="flex flex-wrap gap-2">
                    {room.equipment.map((item, index) => (
                      <span 
                        key={index}
                        className="bg-blue-50 text-blue-600 text-xs px-2 py-1 rounded"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <Link 
                    to={`/rooms/${room._id}`}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    View Details
                  </Link>
                  
                  <Link
                    to={`/book?roomId=${room._id}`}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Book Now
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        {filteredRooms.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No rooms found matching your search.</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default RoomList;