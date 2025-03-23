import React, { useState, useEffect } from "react";
import { useParams, Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/OrderConfirmation.css";

const OrderConfirmation = () => {
  const { orderId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [orderItems, setOrderItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Debug the orderId parameter and route
  console.log("OrderConfirmation - orderId from useParams:", orderId);
  console.log("OrderConfirmation - current path:", location.pathname);
  console.log("OrderConfirmation - location state:", location.state);

  useEffect(() => {
    // Try to get the order ID from different sources
    const effectiveOrderId = orderId || location.state?.orderId;
    console.log("Effective order ID:", effectiveOrderId);
    
    // Check if we should use localStorage data
    const useLocalStorage = !effectiveOrderId || location.state?.useLocalStorage;
    
    if (useLocalStorage) {
      // Try to get order data from localStorage
      try {
        const lastOrderJson = localStorage.getItem('lastOrder');
        console.log("Last order from localStorage:", lastOrderJson);
        
        if (lastOrderJson) {
          const lastOrder = JSON.parse(lastOrderJson);
          const orderData = lastOrder.order;
          
          // Check if the order data is recent (within the last hour)
          const isRecent = (new Date().getTime() - lastOrder.timestamp) < 3600000;
          
          if (isRecent && orderData) {
            console.log("Using order data from localStorage:", orderData);
            setOrder(orderData);
            
            // If we have order items in the localStorage data, use them
            if (orderData.orderItems) {
              setOrderItems(orderData.orderItems);
              setLoading(false);
              return;
            } else {
              // Otherwise, try to fetch them if we have an ID
              const storedOrderId = orderData.orderId || orderData.id;
              if (storedOrderId) {
                fetchOrderItems(storedOrderId);
                setLoading(false);
                return;
              }
            }
          }
        }
      } catch (err) {
        console.error("Error reading from localStorage:", err);
      }
    }
    
    // If we have an effective order ID, fetch the order details
    if (effectiveOrderId) {
      fetchOrderDetails(effectiveOrderId);
    } else {
      // No order ID and no localStorage data, check if we can recover from URL
      const pathSegments = location.pathname.split('/');
      const potentialOrderId = pathSegments[pathSegments.length - 1];
      
      // If the last segment looks like a number, try it as an order ID
      if (potentialOrderId && /^\d+$/.test(potentialOrderId)) {
        console.log("Attempting to recover order ID from URL:", potentialOrderId);
        fetchOrderDetails(potentialOrderId);
      } else {
        setError("No order ID provided and no recent order found. Unable to fetch order details.");
        setLoading(false);
      }
    }
  }, [orderId, location]);

  const fetchOrderDetails = async (id) => {
    try {
      setLoading(true);
      console.log("Fetching order with ID:", id);
      
      // Fetch order details
      const orderResponse = await axios.get(`http://localhost:8080/api/orders/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        withCredentials: true
      });
      
      console.log("Order response:", orderResponse.data);
      
      // Multi-layered approach to handle the order data
      let processedOrder = null;
      
      // First attempt: Create a simplified order object directly from the response
      try {
        // Create a simplified order object to avoid circular references
        const simplifiedOrder = {
          orderId: orderResponse.data.id || orderResponse.data.orderId || id,
          totalAmount: orderResponse.data.totalAmount,
          status: orderResponse.data.status,
          orderDate: orderResponse.data.orderDate,
          paymentMethod: orderResponse.data.paymentMethod
        };
        
        // Extract user information safely
        if (orderResponse.data.user) {
          simplifiedOrder.customerName = orderResponse.data.user.username;
          simplifiedOrder.userId = orderResponse.data.user.userId || orderResponse.data.user.id;
          simplifiedOrder.email = orderResponse.data.user.email;
        }
        
        // Handle shipping and billing addresses
        if (orderResponse.data.shippingAddress) {
          if (typeof orderResponse.data.shippingAddress === 'string') {
            try {
              simplifiedOrder.shippingAddress = JSON.parse(orderResponse.data.shippingAddress);
            } catch (e) {
              simplifiedOrder.shippingAddress = { addressLine1: orderResponse.data.shippingAddress };
            }
          } else {
            simplifiedOrder.shippingAddress = orderResponse.data.shippingAddress;
          }
        }
        
        if (orderResponse.data.billingAddress) {
          if (typeof orderResponse.data.billingAddress === 'string') {
            try {
              simplifiedOrder.billingAddress = JSON.parse(orderResponse.data.billingAddress);
            } catch (e) {
              simplifiedOrder.billingAddress = { addressLine1: orderResponse.data.billingAddress };
            }
          } else {
            simplifiedOrder.billingAddress = orderResponse.data.billingAddress;
          }
        }
        
        // Extract order items if they exist
        if (orderResponse.data.orderItems && Array.isArray(orderResponse.data.orderItems)) {
          simplifiedOrder.orderItems = orderResponse.data.orderItems.map(item => ({
            productId: item.product?.productId || item.product?.id || item.productId,
            quantity: item.quantity,
            price: item.price,
            name: item.product?.name || 'Product',
            imageUrl: item.product?.imageUrl
          }));
          
          // Also set the order items state
          setOrderItems(simplifiedOrder.orderItems);
        }
        
        processedOrder = simplifiedOrder;
        console.log("Successfully created simplified order:", processedOrder);
      } catch (firstAttemptError) {
        console.error("Error in first attempt to simplify order:", firstAttemptError);
        
        // Second attempt: Use a circular reference handler
        try {
          const getCircularReplacer = () => {
            const seen = new WeakSet();
            return (key, value) => {
              if (typeof value === "object" && value !== null) {
                if (seen.has(value)) {
                  return '[Circular]';
                }
                seen.add(value);
              }
              return value;
            };
          };
          
          // Create a safe string version of the order
          const safeOrderString = JSON.stringify(orderResponse.data, getCircularReplacer());
          const safeOrder = JSON.parse(safeOrderString);
          
          // Ensure we have the order ID
          safeOrder.orderId = safeOrder.orderId || safeOrder.id || id;
          
          processedOrder = safeOrder;
          console.log("Successfully created order with circular reference handler:", processedOrder);
        } catch (secondAttemptError) {
          console.error("Error in second attempt with circular reference handler:", secondAttemptError);
          
          // Third attempt: Extract order ID using regex if all else fails
          try {
            const responseStr = JSON.stringify(orderResponse);
            const idMatch = responseStr.match(/"id"\s*:\s*(\d+)/);
            const orderIdMatch = responseStr.match(/"orderId"\s*:\s*(\d+)/);
            const extractedId = (orderIdMatch && orderIdMatch[1]) || (idMatch && idMatch[1]) || id;
            
            // Create a minimal order object
            processedOrder = {
              orderId: extractedId,
              status: 'PENDING',
              orderDate: new Date().toISOString(),
              totalAmount: 0
            };
            
            console.log("Created minimal order with regex-extracted ID:", processedOrder);
          } catch (thirdAttemptError) {
            console.error("All attempts to process order failed:", thirdAttemptError);
            
            // Final fallback
            processedOrder = {
              orderId: id,
              status: 'PENDING',
              orderDate: new Date().toISOString(),
              totalAmount: 0
            };
          }
        }
      }
      
      // Save the processed order to localStorage as a backup
      localStorage.setItem('lastOrder', JSON.stringify({
        order: processedOrder,
        timestamp: new Date().getTime()
      }));
      
      // Set the order in state
      setOrder(processedOrder);
      
      // Fetch order items if we don't have them yet
      if (!processedOrder.orderItems) {
        await fetchOrderItems(processedOrder.orderId);
      }
      
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch order details. Please try again.");
      setLoading(false);
      console.error("Error fetching order details:", err);
      
      // Try to recover from localStorage as a last resort
      try {
        const lastOrderJson = localStorage.getItem('lastOrder');
        if (lastOrderJson) {
          const lastOrder = JSON.parse(lastOrderJson);
          if (lastOrder.order && (lastOrder.order.orderId == id || !id)) {
            console.log("Recovered order from localStorage after API error");
            setOrder(lastOrder.order);
            
            // If we have order items, use them
            if (lastOrder.order.orderItems) {
              setOrderItems(lastOrder.order.orderItems);
            }
            
            setLoading(false);
            setError(null);
          }
        }
      } catch (localStorageErr) {
        console.error("Error recovering from localStorage:", localStorageErr);
      }
    }
  };

  const fetchOrderItems = async (id) => {
    try {
      const itemsResponse = await axios.get(`http://localhost:8080/api/order-details/order/${id}`, {
        withCredentials: true
      });
      
      console.log("Items response:", itemsResponse.data);
      setOrderItems(itemsResponse.data);
    } catch (err) {
      console.error("Error fetching order items:", err);
    }
  };

  if (loading) return <div className="loading">Loading order details...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!order) return <div className="error">Order not found</div>;

  // Safely handle the order data
  const orderDate = order.orderDate || new Date().toISOString();
  const customerName = order.customerName || (order.user ? order.user.username : "Customer");
  const displayId = order.orderId || order.id || orderId;
  const status = order.status || "PENDING";
  const totalAmount = order.totalAmount || 0;
  
  // Safely handle addresses - they might be strings or objects
  let shippingAddress = {};
  let billingAddress = null;
  
  try {
    if (order.shippingAddress) {
      if (typeof order.shippingAddress === 'string') {
        shippingAddress = JSON.parse(order.shippingAddress);
      } else {
        shippingAddress = order.shippingAddress;
      }
    }
    
    if (order.billingAddress) {
      if (typeof order.billingAddress === 'string') {
        billingAddress = JSON.parse(order.billingAddress);
      } else {
        billingAddress = order.billingAddress;
      }
    }
  } catch (e) {
    console.error("Error parsing addresses:", e);
    // Use default empty objects if parsing fails
    shippingAddress = {};
    billingAddress = null;
  }

  return (
    <div className="order-confirmation-container">
      <div className="confirmation-header">
        <h2>Order Confirmation</h2>
        <div className="success-checkmark">
          <i className="checkmark">✓</i>
        </div>
        <p className="confirmation-message">
          Thank you for your order, {customerName}!
        </p>
        <p className="order-number">Order #{displayId}</p>
        <p className="order-date">
          Placed on: {new Date(orderDate).toLocaleString()}
        </p>
      </div>
      
      <div className="confirmation-details">
        <div className="order-details-grid">
          <div className="order-detail-card">
            <h3>Order Status</h3>
            <div className="status-badge">{status}</div>
            <p>We'll send you shipping confirmation when your order ships.</p>
          </div>
          
          <div className="order-detail-card">
            <h3>Payment Information</h3>
            <p><strong>Method:</strong> {order.paymentMethod === "cod" ? "Cash on Delivery" : 
               order.paymentMethod === "credit_card" ? "Credit Card" : "UPI"}</p>
            <p><strong>Total:</strong> ₹{parseFloat(totalAmount).toFixed(2)}</p>
          </div>
          
          <div className="order-detail-card">
            <h3>Shipping Address</h3>
            {shippingAddress ? (
              <>
                <p>{shippingAddress.addressLine1 || ""}</p>
                {shippingAddress.addressLine2 && <p>{shippingAddress.addressLine2}</p>}
                <p>{shippingAddress.city || ""}, {shippingAddress.state || ""} {shippingAddress.postalCode || ""}</p>
                <p>{shippingAddress.country || ""}</p>
              </>
            ) : (
              <p>No shipping address provided</p>
            )}
          </div>
          
          <div className="order-detail-card">
            <h3>Billing Address</h3>
            {billingAddress ? (
              <>
                <p>{billingAddress.addressLine1 || ""}</p>
                {billingAddress.addressLine2 && <p>{billingAddress.addressLine2}</p>}
                <p>{billingAddress.city || ""}, {billingAddress.state || ""} {billingAddress.postalCode || ""}</p>
                <p>{billingAddress.country || ""}</p>
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
              {orderItems.map((item, index) => (
                <div className="order-item" key={item.orderDetailId || index}>
                  <div className="item-details">
                    <h4>{item.product ? item.product.name : "Product"}</h4>
                    <p>Quantity: {item.quantity}</p>
                  </div>
                  <div className="item-price">
                    ₹{parseFloat(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
              
              <div className="order-total">
                <span>Total</span>
                <span>₹{parseFloat(totalAmount).toFixed(2)}</span>
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