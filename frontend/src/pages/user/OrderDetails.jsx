import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '../../styles/user/OrderDetails.css';

const OrderDetails = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [orderDetails, setOrderDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const STATUS_STEPS = {
    'PENDING': 1,
    'PROCESSING': 2,
    'SHIPPED': 3,
    'DELIVERED': 4
  };

  useEffect(() => {
    fetchOrderData();
  }, [orderId]);

  const fetchOrderData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch order data
      const orderResponse = await axios.get(
        `http://localhost:8080/api/orders/${orderId}`,
        { withCredentials: true }
      );

      // Fetch order details
      const detailsResponse = await axios.get(
        `http://localhost:8080/api/order-details/order/${orderId}`,
        { withCredentials: true }
      );

      console.log('Order data:', orderResponse.data);
      console.log('Order details:', detailsResponse.data);

      const orderData = orderResponse.data;
      const orderDetailsData = detailsResponse.data;

      // Verify order details structure
      if (Array.isArray(orderDetailsData)) {
        console.log('Number of order items:', orderDetailsData.length);
        if (orderDetailsData.length > 0) {
          console.log('Sample order item:', orderDetailsData[0]);
        }
      } else {
        console.warn('Order details is not an array:', orderDetailsData);
      }
      
      setOrder({
        ...orderData,
        formattedDate: new Date(orderData.orderDate).toLocaleDateString(),
        formattedAmount: new Intl.NumberFormat('en-IN', {
          style: 'currency',
          currency: 'INR',
          minimumFractionDigits: 2
        }).format(orderData.totalAmount)
      });

      // Process order details before setting state
      const processedDetails = Array.isArray(orderDetailsData) ? orderDetailsData.map(detail => ({
        ...detail,
        product: detail.product || {
          name: 'Product Not Found',
          description: 'No description available',
          imageUrl: 'placeholder.jpg'
        }
      })) : [];

      console.log('Processed order details:', processedDetails);
      setOrderDetails(processedDetails);
    } catch (err) {
      console.error('Failed to fetch order data:', err);
      setError(err.response?.data?.message || err.message || 'Failed to load order details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="order-details-loading">
        <div className="spinner"></div>
        <p>Loading order details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="order-details-error">
        <div className="error-icon">!</div>
        <p>{error}</p>
        <button className="btn btn-primary" onClick={fetchOrderData}>
          Retry
        </button>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="order-not-found">
        <h2>Order Not Found</h2>
        <p>The requested order could not be found.</p>
      </div>
    );
  }

  const getStatusStep = (status) => {
    return status === 'CANCELLED' ? -1 : STATUS_STEPS[status] || 0;
  };

  const currentStep = getStatusStep(order.status);

  return (
    <div className="order-details-container">
      <div className="order-header">
        <h1>Order Details</h1>
        <div className="order-id">Order #{orderId}</div>
      </div>

      {/* Status Tracking Bar */}
      <div className="order-status-tracker">
        {order.status !== 'CANCELLED' ? (
          <div className="status-steps">
            {Object.entries(STATUS_STEPS).map(([status, step]) => (
              <div 
                key={status} 
                className={`status-step ${step <= currentStep ? 'completed' : ''} ${step === currentStep ? 'current' : ''}`}
              >
                <div className="step-circle"></div>
                <div className="step-label">{status}</div>
                {step < Object.keys(STATUS_STEPS).length && (
                  <div className={`step-line ${step < currentStep ? 'completed' : ''}`}></div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="cancelled-status">
            <div className="cancelled-badge">CANCELLED</div>
            <p>This order has been cancelled</p>
          </div>
        )}
      </div>

      {/* Order Information */}
      <div className="order-info-grid">
        <div className="order-info-card">
          <h3>Order Summary</h3>
          <div className="info-row">
            <span>Order Date:</span>
            <span>{order.formattedDate}</span>
          </div>
          <div className="info-row">
            <span>Total Amount:</span>
            <span>{order.formattedAmount}</span>
          </div>
          <div className="info-row">
            <span>Status:</span>
            <span className={`status-badge ${order.status.toLowerCase()}`}>
              {order.status}
            </span>
          </div>
        </div>

        <div className="order-info-card">
          <h3>Shipping Details</h3>
          <div className="info-row">
            <span>Name:</span>
            <span>{order.customerName}</span>
          </div>
          <div className="info-row">
            <span>Email:</span>
            <span>{order.email}</span>
          </div>
          <div className="info-row">
            <span>Phone:</span>
            <span>{order.phone || 'N/A'}</span>
          </div>
          <div className="info-row">
            <span>Address:</span>
            <span>{order.shippingAddress || 'N/A'}</span>
          </div>
        </div>

        <div className="order-info-card full-width">
          <h3>Order Items</h3>
          <div className="order-items-table">
            <table>
              <thead>
                <tr>
                  <th>Product Image</th>
                  <th>Product Name</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {orderDetails.length > 0 ? (
                  orderDetails.map((item) => (
                    <tr key={item.orderDetailId}>
                      <td>
                        <img 
                          src={item.product?.imageUrl || '/placeholder.jpg'} 
                          alt={item.product?.name || 'Product Image'}
                          className="product-thumbnail"
                          onError={(e) => {
                            e.target.src = '/placeholder.jpg';
                            e.target.onerror = null;
                          }}
                        />
                      </td>
                      <td>
                        <div className="product-name">{item.product?.name || 'Product Not Found'}</div>
                        <div className="product-description text-muted">
                          {item.product?.description || 'No description available'}
                        </div>
                      </td>
                      <td>{new Intl.NumberFormat('en-IN', {
                        style: 'currency',
                        currency: 'INR'
                      }).format(item.price)}</td>
                      <td>{item.quantity}</td>
                      <td>{new Intl.NumberFormat('en-IN', {
                        style: 'currency',
                        currency: 'INR'
                      }).format(item.price * item.quantity)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center">No items found in this order</td>
                  </tr>
                )}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan="4" className="text-end fw-bold">Subtotal:</td>
                  <td className="fw-bold">{order.formattedAmount}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails; 