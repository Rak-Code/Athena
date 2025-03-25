import React, { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ user, requiredRole, children }) => {
  const location = useLocation();
  
  useEffect(() => {
    console.log("ProtectedRoute - Current user:", user);
    console.log("ProtectedRoute - Required role:", requiredRole);
    console.log("ProtectedRoute - Current path:", location.pathname);
  }, [user, requiredRole, location]);

  // If user is not logged in, redirect to login with return path
  if (!user) {
    console.log("ProtectedRoute - User not logged in, redirecting to login");
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }
  
  // If role is required and user's role doesn't match, redirect to home
  if (requiredRole && user.role !== requiredRole) {
    console.log(`ProtectedRoute - User role (${user.role}) does not match required role (${requiredRole}), redirecting to home`);
    return <Navigate to="/" replace />;
  }

  // If user is authenticated and has the required role, render the protected component
  console.log("ProtectedRoute - Access granted");
  return children;
};

export default ProtectedRoute;