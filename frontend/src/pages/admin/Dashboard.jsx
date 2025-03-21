import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../../styles/admin/Dashboard.css";

const Dashboard = () => {
  console.log("Dashboard component rendering");
  
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    totalRevenue: 0,
    totalProducts: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch orders
      const ordersResponse = await axios.get("http://localhost:8080/api/orders", {
        withCredentials: true
      });
      
      const orders = ordersResponse.data;
      
      // Fetch products
      const productsResponse = await axios.get("http://localhost:8080/api/products", {
        withCredentials: true
      });
      
      // Calculate stats
      const pendingOrders = orders.filter(order => order.status === "PENDING").length;
      const totalRevenue = orders.reduce((sum, order) => sum + parseFloat(order.totalAmount), 0);
      
      setStats({
        totalOrders: orders.length,
        pendingOrders,
        totalRevenue,
        totalProducts: productsResponse.data.length
      });
      
      // Get recent orders (last 5)
      setRecentOrders(orders.slice(0, 5));
      
      setLoading(false);
    } catch (err) {
      setError("Failed to load dashboard data");
      setLoading(false);
      console.error("Error fetching dashboard data:", err);
    }
  };

  if (loading) return <div className="loading">Loading dashboard data...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <div className="admin-actions">
          <Link to="/admin/products/add" className="btn btn-primary">Add New Product</Link>
        </div>
      </div>
      
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Orders</h3>
          <p className="stat-value">{stats.totalOrders}</p>
          <Link to="/admin/orders" className="stat-link">View All Orders</Link>
        </div>
        
        <div className="stat-card">
          <h3>Pending Orders</h3>
          <p className="stat-value">{stats.pendingOrders}</p>
          <Link to="/admin/orders?status=PENDING" className="stat-link">View Pending Orders</Link>
        </div>
        
        <div className="stat-card">
          <h3>Total Revenue</h3>
          <p className="stat-value">₹{stats.totalRevenue.toFixed(2)}</p>
        </div>
        
        <div className="stat-card">
          <h3>Total Products</h3>
          <p className="stat-value">{stats.totalProducts}</p>
          <Link to="/admin/products" className="stat-link">Manage Products</Link>
        </div>
      </div>
      
      <div className="recent-orders">
        <h2>Recent Orders</h2>
        {recentOrders.length === 0 ? (
          <p>No recent orders found</p>
        ) : (
          <table className="orders-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map(order => (
                <tr key={order.orderId}>
                  <td>#{order.orderId}</td>
                  <td>{order.customerName || order.user?.username || "Guest"}</td>
                  <td>{new Date(order.orderDate).toLocaleDateString()}</td>
                  <td>₹{parseFloat(order.totalAmount).toFixed(2)}</td>
                  <td>
                    <span className={`status-badge ${order.status.toLowerCase()}`}>
                      {order.status}
                    </span>
                  </td>
                  <td>
                    <Link to={`/admin/orders/${order.orderId}`} className="btn btn-sm btn-info">
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <div className="view-all">
          <Link to="/admin/orders" className="btn btn-secondary">View All Orders</Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;