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
                Dashboard
              </Link>
            </li>
            <li>
              <Link 
                to="/admin/products" 
                className={isActive("/admin/products") ? "active" : ""}
              >
                Products
              </Link>
            </li>
            <li>
              <Link 
                to="/admin/orders" 
                className={isActive("/admin/orders") ? "active" : ""}
              >
                Orders
              </Link>
            </li>
            <li>
              <Link to="/" className="back-to-site">
                Back to Site
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