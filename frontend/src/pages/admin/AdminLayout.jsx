// AdminLayout.jsx
import React from "react";
import { Link, useLocation } from "react-router-dom";
import "../../styles/admin/AdminLayout.css";

const AdminLayout = ({ children }) => {
  const location = useLocation();
  
  // Check if the current path is active
  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };
  
  return (
    <div className="admin-layout">
      <div className="admin-sidebar">
        <div className="sidebar-header">
          <h2>Admin Panel</h2>
        </div>
        <nav className="sidebar-nav">
          <ul>
            <li>
              <Link 
                to="/admin" 
                className={isActive("/admin") && !isActive("/admin/products") && !isActive("/admin/orders") ? "active" : ""}
              >
                <i className="fas fa-tachometer-alt"></i> Dashboard
              </Link>
            </li>
            <li>
              <Link 
                to="/admin/products" 
                className={isActive("/admin/products") ? "active" : ""}
              >
                <i className="fas fa-box"></i> Products
              </Link>
            </li>
            <li>
              <Link 
                to="/admin/orders" 
                className={isActive("/admin/orders") ? "active" : ""}
              >
                <i className="fas fa-shopping-cart"></i> Orders
              </Link>
            </li>
            <li>
              <Link to="/" className="back-to-site">
                <i className="fas fa-arrow-left"></i> Back to Site
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