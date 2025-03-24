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
    
    // Set up polling to refresh dashboard data every 30 seconds
    const pollingInterval = setInterval(() => {
      console.log("Polling for dashboard updates...");
      fetchDashboardData(false); // Don't show loading state for background refreshes
    }, 30000);
    
    // Clean up interval on component unmount
    return () => clearInterval(pollingInterval);
  }, []);

  const fetchDashboardData = async (showLoading = true) => {
    try {
      if (showLoading) {
        setLoading(true);
      }
      
      // Add timestamp to prevent caching
      const timestamp = new Date().getTime();
      
      // Fetch orders with cache-busting parameter
      const ordersResponse = await axios.get(`http://localhost:8080/api/orders?_t=${timestamp}`, {
        withCredentials: true
      });
      
      const ordersData = ordersResponse.data;
      console.log("Total orders fetched:", ordersData.length);
      
      // Check if any orders have undefined/null status
      const ordersWithIssues = ordersData.filter(order => !order.status);
      if (ordersWithIssues.length > 0) {
        console.warn("Found orders with undefined status:", ordersWithIssues);
      }
      
      // Normalize orders data by ensuring all required fields exist
      const normalizedOrders = ordersData.map(order => ({
        ...order,
        status: order.status || "PENDING",
        orderDate: order.orderDate || new Date().toISOString(),
        totalAmount: order.totalAmount || 0
      }));
      
      // Fetch products with cache-busting parameter
      const productsResponse = await axios.get(`http://localhost:8080/api/products?_t=${timestamp}`, {
        withCredentials: true
      });
      
      // Calculate stats
      const pendingOrders = normalizedOrders.filter(order => order.status === "PENDING").length;
      
      // Calculate total revenue
      const totalRevenue = normalizedOrders.reduce((sum, order) => {
        // Check if totalAmount exists and is a valid number
        const amount = parseFloat(order.totalAmount);
        // Only add to sum if it's a valid number
        return sum + (isNaN(amount) ? 0 : amount);
      }, 0);
      
      setStats({
        totalOrders: normalizedOrders.length,
        pendingOrders,
        totalRevenue,
        totalProducts: productsResponse.data.length
      });
      
      // Sort orders by date (newest first) and get recent orders (last 10)
      const sortedOrders = [...normalizedOrders].sort((a, b) => {
        const dateA = new Date(a.orderDate || 0);
        const dateB = new Date(b.orderDate || 0);
        return dateB - dateA;
      });
      
      // Get the most recent 10 orders (or all if less than 10)
      const recentOrdersToShow = sortedOrders.slice(0, 10);
      console.log("Showing recent orders:", recentOrdersToShow.length);
      
      setRecentOrders(recentOrdersToShow);
      
      if (showLoading) {
        setLoading(false);
      }
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      console.error("Error details:", err.response ? err.response.data : err.message);
      
      setError("Failed to load dashboard data");
      
      if (showLoading) {
        setLoading(false);
      }
    }
  };

  if (loading) return <div className="loading">Loading dashboard data...</div>;
  if (error) return (
    <div className="error">
      <div>{error}</div>
      <button className="btn btn-primary mt-3" onClick={() => fetchDashboardData()}>
        Try Again
      </button>
    </div>
  );

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <div className="admin-actions">
          <button 
            className="btn btn-outline-primary me-2"
            onClick={() => fetchDashboardData()}
          >
            <i className="fa fa-refresh"></i> Refresh Data
          </button>
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
              {recentOrders.map(order => {
                // Skip rendering any invalid orders
                if (!order || !order.orderId) {
                  return null;
                }
                
                return (
                  <tr key={order.orderId || `order-${Math.random()}`}>
                    <td>#{order.orderId}</td>
                    <td>{order.customerName || order.user?.username || "Guest"}</td>
                    <td>{order.orderDate ? new Date(order.orderDate).toLocaleDateString() : "N/A"}</td>
                    <td>₹{parseFloat(order.totalAmount || 0).toFixed(2)}</td>
                    <td>
                      <span className={`status-badge ${order.status ? order.status.toLowerCase() : 'pending'}`}>
                        {order.status || "PENDING"}
                      </span>
                    </td>
                    <td>
                      <Link to={`/admin/orders/${order.orderId}`} className="btn btn-sm btn-info">
                        View
                      </Link>
                    </td>
                  </tr>
                );
              })}
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