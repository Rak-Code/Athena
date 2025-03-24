import React, { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ user, requiredRole, children, redirectPath = "/login" }) => {
  const location = useLocation();
  
  useEffect(() => {
    console.log("ProtectedRoute - Current user:", user);
    console.log("ProtectedRoute - Required role:", requiredRole);
    console.log("ProtectedRoute - Current path:", location.pathname);
  }, [user, requiredRole, location]);

  // If user is not logged in or doesn't have the required role, redirect to login
  if (!user) {
    console.log("ProtectedRoute - User not logged in, redirecting to:", redirectPath);
    return <Navigate to={redirectPath} replace state={{ from: location.pathname }} />;
  }
  
  if (requiredRole && user.role !== requiredRole) {
    console.log(`ProtectedRoute - User role (${user.role}) does not match required role (${requiredRole}), redirecting`);
    return <Navigate to={redirectPath} replace state={{ from: location.pathname }} />;
  }

  // If user is authenticated and has the required role, render the children
  console.log("ProtectedRoute - Access granted");
  return children;
};

export default ProtectedRoute;