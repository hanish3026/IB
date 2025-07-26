import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  // Check if user is authenticated
  const isAuthenticated = () => {
    const token = localStorage.getItem('authToken');
    return !!token; // Returns true if token exists
  };

  // If not authenticated, redirect to login
  if (!isAuthenticated()) {
    console.log("Not authenticated, redirecting to login");
    return <Navigate to="/login" replace />;
  }

  // If authenticated, render the protected component
  console.log("User authenticated, rendering protected content");
  return children;
};

export default ProtectedRoute;