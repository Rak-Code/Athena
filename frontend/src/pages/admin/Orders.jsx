import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "../../styles/admin/Orders.css";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage] = useState(10);
  const location = useLocation();
  const navigate = useNavigate();
  
  // Parse query parameters on component mount and location change
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const statusParam = queryParams.get('status');
    
    if (statusParam) {
      console.log("Setting filter from URL parameter:", statusParam);
      setFilter(statusParam.toUpperCase());
    }
    
    // Force a refresh of orders when component mounts or location changes
    setLoading(true);
    fetchOrders();
    
    // Set up polling to fetch orders every 30 seconds
    const pollingInterval = setInterval(() => {
      console.log("Polling for new orders...");
      fetchOrders(false); // Don't set loading state for polling refreshes
    }, 30000);
    
    // Clean up interval on component unmount
    return () => clearInterval(pollingInterval);
  }, [location]);

  const fetchOrders = async (showLoading = true) => {
    try {
      if (showLoading) {
        setLoading(true);
      }
      
      // Add a timestamp to prevent caching
      const timestamp = new Date().getTime();
      const response = await axios.get(`http://localhost:8080/api/orders?_t=${timestamp}`, {
        withCredentials: true
      });
      
      // Add more detailed logging to debug the issue
      console.log("Raw orders response:", response);
      console.log("Fetched orders:", response.data);
      console.log("Total orders count:", response.data.length);
      
      // Log the order IDs to see what orders we're actually getting
      const orderIds = response.data.map(order => order.orderId).sort((a, b) => a - b);
      console.log("Order IDs received:", orderIds);
      
      // Check for missing order IDs - helpful for debugging
      const maxOrderId = Math.max(...orderIds, 0); // Use 0 as fallback if array is empty
      const missingOrderIds = [];
      for (let i = 1; i <= maxOrderId; i++) {
        if (!orderIds.includes(i)) {
          missingOrderIds.push(i);
        }
      }
      if (missingOrderIds.length > 0) {
        console.warn("Missing order IDs:", missingOrderIds);
      }
      
      // Process and validate each order's status
      const processedOrders = response.data.map(order => {
        // Ensure status is a valid enum value
        const validStatuses = ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];
        const currentStatus = order.status?.toUpperCase();
        
        if (!currentStatus || !validStatuses.includes(currentStatus)) {
          console.warn(`Order ${order.orderId} has invalid status: ${order.status}. Setting to PENDING.`);
          
          // Fix any order with invalid status, not just #10
          (async () => {
            try {
              console.log(`Attempting to fix status for order #${order.orderId}`);
              await axios.put(`http://localhost:8080/api/orders/${order.orderId}/status?status=PENDING`, {}, {
                withCredentials: true
              });
              console.log(`Successfully fixed status for order #${order.orderId}`);
            } catch (fixErr) {
              console.error(`Failed to fix status for order #${order.orderId}:`, fixErr);
            }
          })();
          
          return {
            ...order,
            status: "PENDING"
          };
        }
        
        return {
          ...order,
          status: currentStatus
        };
      });
      
      // Sort orders by date (newest first)
      const sortedOrders = processedOrders.sort((a, b) => {
        const dateA = a.orderDate ? new Date(a.orderDate) : new Date(0);
        const dateB = b.orderDate ? new Date(b.orderDate) : new Date(0);
        return dateB - dateA;
      });
      
      // Set state with the sorted and processed orders
      setOrders(sortedOrders);
      
      if (showLoading) {
        setLoading(false);
      }
    } catch (err) {
      console.error("Error fetching orders:", err);
      console.error("Error details:", err.response ? err.response.data : err.message);
      setError("Failed to load orders. Please try refreshing the page.");
      if (showLoading) {
        setLoading(false);
      }
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      // Find the current order
      const currentOrder = orders.find(order => order.orderId === orderId);
      if (!currentOrder) {
        throw new Error(`Order #${orderId} not found`);
      }

      // Check if status is already the same
      if (currentOrder.status === newStatus) {
        console.log(`Order #${orderId} is already in ${newStatus} status. No update needed.`);
        return; // Exit early, no need to make an API call
      }
      
      // Validate the new status
      const validStatuses = ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];
      if (!validStatuses.includes(newStatus)) {
        throw new Error(`Invalid status: ${newStatus}`);
      }

      console.log(`Updating order ${orderId} status to ${newStatus}`);
      
      const response = await axios.put(`http://localhost:8080/api/orders/${orderId}/status?status=${newStatus}`, {}, {
        withCredentials: true
      });
      
      if (response.data && response.data.status === newStatus) {
        // Update the local state
        setOrders(prevOrders => 
          prevOrders.map(order => 
            order.orderId === orderId ? { ...order, status: newStatus } : order
          )
        );
        alert(`Order #${orderId} status successfully updated to ${newStatus}`);
      } else {
        console.warn("Status update response:", response.data);
        await fetchOrders(); // Refresh to get the current state
        alert("Status update may not have been applied correctly. The page will refresh to show the current status.");
      }
    } catch (err) {
      console.error("Error updating order status:", err);
      
      let errorMessage = "Failed to update order status. ";
      
      if (err.response) {
        const serverError = err.response.data?.error || err.response.data?.message;
        if (err.response.status === 400) {
          errorMessage += serverError || "Invalid status transition. Please follow the order flow: PENDING → PROCESSING → SHIPPED → DELIVERED";
        } else if (err.response.status === 404) {
          errorMessage += serverError || "Order not found.";
        } else if (err.response.status === 500) {
          errorMessage += serverError || "Server error occurred.";
        }
      } else if (err.message) {
        errorMessage += err.message;
      }
      
      alert(errorMessage);
      await fetchOrders(); // Refresh to get the current state
    }
  };

  // Handle filter change
  const handleFilterChange = (newFilter) => {
    console.log("Setting filter to:", newFilter);
    setFilter(newFilter);
    setCurrentPage(1); // Reset to first page
    
    // Update URL to reflect the filter (except for ALL)
    if (newFilter === "ALL") {
      navigate("/admin/orders");
    } else {
      navigate(`/admin/orders?status=${newFilter}`);
    }
  };

  // Filter orders based on status
  const filteredOrders = filter === "ALL" 
    ? orders 
    : orders.filter(order => order.status === filter || 
                   (!order.status && filter === "PENDING")); // Treat undefined status as PENDING

  // Pagination
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Add a function to refresh orders manually
  const refreshOrders = () => {
    setLoading(true);
    fetchOrders();
  };

  if (loading) return <div className="loading">Loading orders...</div>;
  if (error) return (
    <div className="error">
      <div>{error}</div>
      <button className="btn btn-primary mt-3" onClick={refreshOrders}>Try Again</button>
    </div>
  );

  return (
    <div className="admin-orders">
      <div className="admin-header">
        <h1>Manage Orders</h1>
        <div className="order-summary">
          <p>Showing {filteredOrders.length} of {orders.length} total orders</p>
          <button className="btn btn-sm btn-outline-primary" onClick={refreshOrders}>
            <i className="fa fa-refresh"></i> Refresh Orders
          </button>
        </div>
        <div className="filter-controls">
          <label htmlFor="status-filter">Filter by Status:</label>
          <select
            id="status-filter"
            value={filter}
            onChange={(e) => handleFilterChange(e.target.value)}
          >
            <option value="ALL">All Orders ({orders.length})</option>
            <option value="PENDING">Pending ({orders.filter(o => o.status === "PENDING").length})</option>
            <option value="PROCESSING">Processing ({orders.filter(o => o.status === "PROCESSING").length})</option>
            <option value="SHIPPED">Shipped ({orders.filter(o => o.status === "SHIPPED").length})</option>
            <option value="DELIVERED">Delivered ({orders.filter(o => o.status === "DELIVERED").length})</option>
            <option value="CANCELLED">Cancelled ({orders.filter(o => o.status === "CANCELLED").length})</option>
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
                    <td>{order.orderDate ? new Date(order.orderDate).toLocaleDateString() : "N/A"}</td>
                    <td>₹{parseFloat(order.totalAmount || 0).toFixed(2)}</td>
                    <td>
                      <select
                        value={order.status || "PENDING"}
                        onChange={(e) => handleStatusChange(order.orderId, e.target.value)}
                        className={`status-select ${order.status ? order.status.toLowerCase() : 'pending'}`}
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