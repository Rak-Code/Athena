import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ user, requiredRole, children, redirectPath = "/login" }) => {
  // If user is not logged in or doesn't have the required role, redirect to login
  if (!user || (requiredRole && user.role !== requiredRole)) {
    return <Navigate to={redirectPath} replace />;
  }

  // If user is authenticated and has the required role, render the children
  return children;
};

export default ProtectedRoute;