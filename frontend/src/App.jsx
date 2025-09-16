import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuthContext } from './context/AuthContext';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import RoomList from './pages/RoomList';
import RoomDetail from './pages/RoomDetail';
import BookingForm from './pages/BookingForm';
import MyBookings from './pages/MyBookings';

// Protected route component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuthContext();
  
  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  return children;
};

const AppRoutes = () => {
  const { user } = useAuthContext();
  
  return (
    <Routes>
      <Route 
        path="/login" 
        element={user ? <Navigate to="/" /> : <Login />} 
      />
      
      <Route 
        path="/" 
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/rooms" 
        element={
          <ProtectedRoute>
            <RoomList />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/rooms/:id" 
        element={
          <ProtectedRoute>
            <RoomDetail />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/book" 
        element={
          <ProtectedRoute>
            <BookingForm />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/my-bookings" 
        element={
          <ProtectedRoute>
            <MyBookings />
          </ProtectedRoute>
        } 
      />
      
      {/* Fallback route */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster position="top-right" />
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;