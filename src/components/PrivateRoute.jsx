import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../firebase/useAuth'; // Adjust path
import Loader from '../helperComponents/Loader';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div style={{marginLeft:'8%'}}><Loader/></div>; // Optional: replace with spinner
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default PrivateRoute;
