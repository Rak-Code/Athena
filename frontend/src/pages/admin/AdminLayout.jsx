// AdminLayout.jsx
import React, { useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "../../styles/admin/AdminLayout.css";
import { FaHome, FaBox, FaShoppingBag, FaStar, FaArrowLeft } from "react-icons/fa";

const AdminLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    console.log("AdminLayout - Current path:", location.pathname);
    
    // Check if user is logged in and has admin role
    const user = JSON.parse(localStorage.getItem("user"));
    console.log("AdminLayout - User from localStorage:", user);
    
    if (!user || (user.role !== "ADMIN" && user.role !== "SUPER_ADMIN")) {
      console.log("AdminLayout - Unauthorized access, redirecting to login");
      navigate("/login");
    }
  }, [navigate, location]);
  
  // Helper function to check if a link is active
  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <div className="admin-layout">
      <div className="admin-sidebar">
        <div className="sidebar-header">
          <h3>Admin Panel</h3>
        </div>
        <nav className="sidebar-nav">
          <ul>
            <li className={isActive("/admin") && !isActive("/admin/products") && !isActive("/admin/orders") && !isActive("/admin/reviews") ? "active" : ""}>
              <Link to="/admin">
                <FaHome className="nav-icon" /> Dashboard
              </Link>
            </li>
            <li className={isActive("/admin/products") ? "active" : ""}>
              <Link to="/admin/products">
                <FaBox className="nav-icon" /> Products
              </Link>
            </li>
            <li className={isActive("/admin/orders") ? "active" : ""}>
              <Link to="/admin/orders">
                <FaShoppingBag className="nav-icon" /> Orders
              </Link>
            </li>
            <li className={isActive("/admin/reviews") ? "active" : ""}>
              <Link to="/admin/reviews">
                <FaStar className="nav-icon" /> Reviews
              </Link>
            </li>
            <li>
              <Link to="/" className="back-to-site">
                <FaArrowLeft className="nav-icon" /> Back to Site
              </Link>
            </li>
          </ul>
        </nav>
      </div>
      <div className="admin-content">
        {children}
      </div>
    </div>
  );
};

export default AdminLayout;