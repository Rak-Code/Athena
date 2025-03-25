import React, { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ user, requiredRole, children }) => {
  const location = useLocation();
  
  useEffect(() => {
    console.log("ProtectedRoute - Current user:", user);
    console.log("ProtectedRoute - Required role:", requiredRole);
    console.log("ProtectedRoute - Current path:", location.pathname);
  }, [user, requiredRole, location]);

  // Check if we have a stored user when no user prop is provided
  if (!user) {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser && (!requiredRole || parsedUser.role === requiredRole)) {
          return children;
        }
      } catch (error) {
        console.error("Error parsing stored user:", error);
      }
    }
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }
  
  // If role is required and user's role doesn't match, redirect to home
  if (requiredRole && user.role !== requiredRole) {
    console.log(`ProtectedRoute - User role (${user.role}) does not match required role (${requiredRole}), redirecting to home`);
    return <Navigate to="/" replace />;
  }

  // If user is authenticated and has the required role, render the protected component
  return children;
};

export default ProtectedRoute;