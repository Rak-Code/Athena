import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "../../styles/admin/Orders.css";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("ALL");
  const location = useLocation();
  const navigate = useNavigate();

  const STATUS_OPTIONS = {
    PENDING: "PENDING",
    PROCESSING: "PROCESSING",
    SHIPPED: "SHIPPED",
    DELIVERED: "DELIVERED",
    CANCELLED: "CANCELLED"
  };

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const statusParam = queryParams.get('status');
    if (statusParam && STATUS_OPTIONS[statusParam.toUpperCase()]) {
      setFilter(statusParam.toUpperCase());
    }

    fetchOrders();

    const pollingInterval = setInterval(fetchOrders, 30000);
    return () => clearInterval(pollingInterval);
  }, [location]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // First try to get all orders at once
      let response = await axios.get(`http://localhost:8080/api/orders`, {
        withCredentials: true
      });

      // If we get fewer orders than expected, try paginated approach
      if (response.data.length < 32) {
        console.log("Initial fetch got fewer orders than expected, trying paginated approach");
        const allOrders = [];
        let page = 0;
        const pageSize = 10;
        let hasMore = true;

        while (hasMore) {
          const pageResponse = await axios.get(`http://localhost:8080/api/orders`, {
            params: { 
              page: page,
              size: pageSize,
              sort: 'orderDate,desc'
            },
            withCredentials: true
          });

          if (!pageResponse.data || !Array.isArray(pageResponse.data)) {
            throw new Error("Invalid data format received from server");
          }

          allOrders.push(...pageResponse.data);
          
          if (pageResponse.data.length < pageSize) {
            hasMore = false;
          } else {
            page++;
          }
        }
        response.data = allOrders;
      }

      console.log("Total orders received:", response.data.length);

      const processedOrders = response.data.map(order => {
        // Normalize status
        const status = STATUS_OPTIONS[order.status?.toUpperCase()] || STATUS_OPTIONS.PENDING;
        
        // Determine display name with proper fallbacks
        const displayName = order.customerName || 
                          (order.user ? (order.user.username || order.user.email?.split('@')[0]) : null) || 
                          order.email?.split('@')[0] || 
                          "Guest";

        return {
          ...order,
          status,
          displayName,
          formattedDate: order.orderDate ? 
            new Date(order.orderDate).toLocaleDateString() : 
            "N/A",
          formattedAmount: new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 2
          }).format(order.totalAmount || 0)
        };
      });

      setOrders(processedOrders);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
      setError(err.response?.data?.message || err.message || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    if (!STATUS_OPTIONS[newStatus]) {
      alert("Invalid status selected");
      return;
    }

    try {
      const response = await axios.put(
        `http://localhost:8080/api/orders/${orderId}/status?status=${newStatus}`,
        {},
        { withCredentials: true }
      );

      if (response.data?.status === newStatus) {
        setOrders(prev => 
          prev.map(order => 
            order.orderId === orderId ? 
              { ...order, status: newStatus } : 
              order
          )
        );
      } else {
        throw new Error("Status update not confirmed by server");
      }
    } catch (err) {
      console.error("Status update failed:", err);
      alert(err.response?.data?.error || "Failed to update order status");
      fetchOrders();
    }
  };

  const handleFilterChange = (newFilter) => {
    if (newFilter === "ALL" || STATUS_OPTIONS[newFilter]) {
      setFilter(newFilter);
      navigate(newFilter === "ALL" ? 
        "/admin/orders" : 
        `/admin/orders?status=${newFilter}`
      );
    }
  };

  const filteredOrders = filter === "ALL" 
    ? orders 
    : orders.filter(order => order.status === filter);

  const statusCounts = orders.reduce((acc, order) => {
    acc[order.status] = (acc[order.status] || 0) + 1;
    return acc;
  }, {ALL: orders.length});

  if (loading) return (
    <div className="loading">
      <div className="spinner"></div>
      <p>Loading orders...</p>
    </div>
  );

  if (error) return (
    <div className="error">
      <div className="error-icon">!</div>
      <div>{error}</div>
      <button className="btn btn-primary mt-3" onClick={fetchOrders}>
        Retry
      </button>
    </div>
  );

  return (
    <div className="admin-orders">
      <div className="admin-header">
        <h1>Manage Orders</h1>
        <div className="order-controls">
          <div className="order-summary">
            <span>
              Showing <strong>{filteredOrders.length}</strong> orders
              {filter !== "ALL" && (
                <span> (filtered from {orders.length} total)</span>
              )}
            </span>
            <button 
              className="btn btn-sm btn-outline-primary" 
              onClick={fetchOrders}
              disabled={loading}
            >
              <i className="fa fa-refresh"></i> Refresh
            </button>
          </div>
          
          <div className="filter-controls">
            <label htmlFor="status-filter">Filter by Status:</label>
            <select
              id="status-filter"
              value={filter}
              onChange={(e) => handleFilterChange(e.target.value)}
              className="status-filter"
              disabled={loading}
            >
              {Object.entries(STATUS_OPTIONS).map(([key, value]) => (
                <option key={key} value={value}>
                  {key} ({statusCounts[value] || 0})
                </option>
              ))}
              <option value="ALL">All Orders ({statusCounts.ALL})</option>
            </select>
          </div>
        </div>
      </div>
      
      {filteredOrders.length === 0 ? (
        <div className="no-orders">
          <i className="fa fa-box-open"></i>
          <p>No orders found</p>
          {filter !== "ALL" && (
            <button 
              className="btn btn-link" 
              onClick={() => handleFilterChange("ALL")}
            >
              Clear filters
            </button>
          )}
        </div>
      ) : (
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
              {filteredOrders.map(order => (
                <tr key={order.orderId}>
                  <td>#{order.orderId}</td>
                  <td>
                    {order.displayName}
                    {order.email && <div className="order-email">{order.email}</div>}
                  </td>
                  <td>{order.formattedDate}</td>
                  <td>{order.formattedAmount}</td>
                  <td>
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.orderId, e.target.value)}
                      className={`status-select ${order.status.toLowerCase()}`}
                      disabled={loading}
                    >
                      {Object.values(STATUS_OPTIONS).map(status => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <Link 
                      to={`/admin/orders/${order.orderId}`} 
                      className="btn btn-sm btn-info"
                    >
                      <i className="fa fa-eye"></i> View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Orders;