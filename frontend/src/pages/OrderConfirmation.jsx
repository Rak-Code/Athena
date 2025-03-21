import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import "../styles/OrderConfirmation.css";

const OrderConfirmation = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [orderItems, setOrderItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOrderDetails();
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      
      // Fetch order details
      const orderResponse = await axios.get(`http://localhost:8080/api/orders/${orderId}`, {
        withCredentials: true
      });
      
      setOrder(orderResponse.data);
      
      // Fetch order items
      const itemsResponse = await axios.get(`http://localhost:8080/api/orders/${orderId}/items`, {
        withCredentials: true
      });
      
      setOrderItems(itemsResponse.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch order details. Please try again.");
      setLoading(false);
      console.error("Error fetching order details:", err);
    }
  };

  if (loading) return <div className="loading">Loading order details...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!order) return <div className="error">Order not found</div>;

  // Parse JSON strings to objects
  const shippingAddress = JSON.parse(order.shippingAddress);
  const billingAddress = order.billingAddress ? JSON.parse(order.billingAddress) : null;

  return (
    <div className="order-confirmation-container">
      <div className="confirmation-header">
        <h2>Order Confirmation</h2>
        <div className="success-checkmark">
          <i className="checkmark">✓</i>
        </div>
        <p className="confirmation-message">
          Thank you for your order, {order.customerName}!
        </p>
        <p className="order-number">Order #{order.id}</p>
        <p className="order-date">
          Placed on: {new Date(order.orderDate).toLocaleString()}
        </p>
      </div>
      
      <div className="confirmation-details">
        <div className="order-details-grid">
          <div className="order-detail-card">
            <h3>Order Status</h3>
            <div className="status-badge">{order.status}</div>
            <p>We'll send you shipping confirmation when your order ships.</p>
          </div>
          
          <div className="order-detail-card">
            <h3>Payment Information</h3>
            <p><strong>Method:</strong> {order.paymentMethod === "cod" ? "Cash on Delivery" : 
               order.paymentMethod === "credit_card" ? "Credit Card" : "UPI"}</p>
            <p><strong>Total:</strong> ₹{order.totalAmount.toFixed(2)}</p>
          </div>
          
          <div className="order-detail-card">
            <h3>Shipping Address</h3>
            <p>{shippingAddress.addressLine1}</p>
            {shippingAddress.addressLine2 && <p>{shippingAddress.addressLine2}</p>}
            <p>{shippingAddress.city}, {shippingAddress.state} {shippingAddress.postalCode}</p>
            <p>{shippingAddress.country}</p>
          </div>
          
          <div className="order-detail-card">
            <h3>Billing Address</h3>
            {billingAddress ? (
              <>
                <p>{billingAddress.addressLine1}</p>
                {billingAddress.addressLine2 && <p>{billingAddress.addressLine2}</p>}
                <p>{billingAddress.city}, {billingAddress.state} {billingAddress.postalCode}</p>
                <p>{billingAddress.country}</p>
              </>
            ) : (
              <p>Same as shipping address</p>
            )}
          </div>
        </div>
        
        <div className="order-items">
          <h3>Order Items</h3>
          {orderItems.length === 0 ? (
            <p>No items found</p>
          ) : (
            <>
              {orderItems.map((item) => (
                <div className="order-item" key={item.id}>
                  <div className="item-details">
                    <h4>{item.productVariant.product.name}</h4>
                    <p>Variant: {item.productVariant.name}</p>
                    <p>Quantity: {item.quantity}</p>
                  </div>
                  <div className="item-price">
                    ₹{(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
              
              <div className="order-total">
                <span>Total</span>
                <span>₹{order.totalAmount.toFixed(2)}</span>
              </div>
            </>
          )}
        </div>
        
        <div className="confirmation-actions">
          <Link to="/" className="action-button primary">Continue Shopping</Link>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;