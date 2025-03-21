import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../../styles/admin/Orders.css";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage] = useState(10);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:8080/api/orders", {
        withCredentials: true
      });
      setOrders(response.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to load orders");
      setLoading(false);
      console.error("Error fetching orders:", err);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await axios.put(`http://localhost:8080/api/orders/${orderId}/status?status=${newStatus}`, {}, {
        withCredentials: true
      });
      
      // Update the order status in the local state
      setOrders(orders.map(order => 
        order.orderId === orderId ? { ...order, status: newStatus } : order
      ));
    } catch (err) {
      console.error("Error updating order status:", err);
      alert("Failed to update order status. Please try again.");
    }
  };

  // Filter orders based on status
  const filteredOrders = filter === "ALL" 
    ? orders 
    : orders.filter(order => order.status === filter);

  // Pagination
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) return <div className="loading">Loading orders...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="admin-orders">
      <div className="admin-header">
        <h1>Manage Orders</h1>
        <div className="filter-controls">
          <label htmlFor="status-filter">Filter by Status:</label>
          <select
            id="status-filter"
            value={filter}
            onChange={(e) => {
              setFilter(e.target.value);
              setCurrentPage(1); // Reset to first page when filter changes
            }}
          >
            <option value="ALL">All Orders</option>
            <option value="PENDING">Pending</option>
            <option value="PROCESSING">Processing</option>
            <option value="SHIPPED">Shipped</option>
            <option value="DELIVERED">Delivered</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
      </div>
      
      {currentOrders.length === 0 ? (
        <div className="no-orders">
          <p>No orders found</p>
        </div>
      ) : (
        <>
          <div className="orders-table-container">
            <table className="orders-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Date</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentOrders.map(order => (
                  <tr key={order.orderId}>
                    <td>#{order.orderId}</td>
                    <td>{order.customerName || order.user?.username || "Guest"}</td>
                    <td>{new Date(order.orderDate).toLocaleDateString()}</td>
                    <td>₹{parseFloat(order.totalAmount).toFixed(2)}</td>
                    <td>
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.orderId, e.target.value)}
                        className={`status-select ${order.status.toLowerCase()}`}
                      >
                        <option value="PENDING">Pending</option>
                        <option value="PROCESSING">Processing</option>
                        <option value="SHIPPED">Shipped</option>
                        <option value="DELIVERED">Delivered</option>
                        <option value="CANCELLED">Cancelled</option>
                      </select>
                    </td>
                    <td>
                      <Link 
                        to={`/admin/orders/${order.orderId}`} 
                        className="btn btn-sm btn-info"
                      >
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination">
              <button 
                onClick={() => paginate(currentPage - 1)} 
                disabled={currentPage === 1}
                className="page-btn"
              >
                Previous
              </button>
              
              {[...Array(totalPages).keys()].map(number => (
                <button
                  key={number + 1}
                  onClick={() => paginate(number + 1)}
                  className={`page-btn ${currentPage === number + 1 ? 'active' : ''}`}
                >
                  {number + 1}
                </button>
              ))}
              
              <button 
                onClick={() => paginate(currentPage + 1)} 
                disabled={currentPage === totalPages}
                className="page-btn"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Orders;