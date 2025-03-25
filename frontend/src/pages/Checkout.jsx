import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Checkout.css";
import axios from "axios";
import { useCart } from "../context/CartContext";
import { getUserAddresses, createAddress } from '../services/AddressService';

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, removeFromCart } = useCart();
  const [totalAmount, setTotalAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    addressLine1: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India",
    paymentMethod: "cod"
  });

  useEffect(() => {
    calculateTotal();
  }, [cart]);

  const calculateTotal = () => {
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    setTotalAmount(total);
  };

  const clearCart = () => {
    cart.forEach(item => {
      removeFromCart(item.productId);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validate address fields
    if (!formData.addressLine1 || !formData.city || !formData.state || !formData.postalCode || !formData.country) {
      setError("Please fill in all address fields");
      setLoading(false);
      return;
    }

    try {
      // Get user data from localStorage
      const userStr = localStorage.getItem('user');
      console.log("Raw user string from localStorage:", userStr);
      
      if (!userStr) {
        setError("Please log in to place an order");
        setLoading(false);
        return;
      }

      let userData;
      try {
        userData = JSON.parse(userStr);
        console.log("Parsed user data:", userData);
        
        // Validate the user data structure
        if (!userData || typeof userData !== 'object') {
          throw new Error("Invalid user data structure");
        }
        
        // Ensure we have a valid user ID
        if (!userData.id && !userData.userId) {
          throw new Error("User ID not found. Please log in again.");
        }
        
        // Use the first available ID
        const userId = parseInt(userData.id || userData.userId);
        if (isNaN(userId)) {
          throw new Error("Invalid user ID format");
        }
        
        // Format the address string
        const formattedAddress = `${formData.addressLine1}, ${formData.city}, ${formData.state}, ${formData.postalCode}, ${formData.country}`;

        // Validate cart items
        if (!cart || cart.length === 0) {
          throw new Error("Your cart is empty");
        }

        // Prepare order data
        const orderData = {
          userId: userId,
          customerName: formData.fullName || userData.username,
          email: formData.email || userData.email,
          phone: formData.phone,
          shippingAddress: formattedAddress,
          billingAddress: formattedAddress,
          paymentMethod: formData.paymentMethod,
          cartItems: cart.map(item => {
            // Validate required fields
            if (!item.productId) {
              throw new Error(`Missing productId for item: ${item.name || 'unknown item'}`);
            }
            if (!item.name) {
              throw new Error(`Missing name for item with ID: ${item.productId}`);
            }
            if (!item.price) {
              throw new Error(`Missing price for item: ${item.name}`);
            }
            if (!item.quantity) {
              throw new Error(`Missing quantity for item: ${item.name}`);
            }
            
            return {
              productId: parseInt(item.productId),
              name: item.name,
              price: parseFloat(item.price),
              quantity: parseInt(item.quantity),
              variantSize: item.variantSize || null,
              variantColor: item.variantColor || null
            };
          })
        };

        console.log("Sending order data:", orderData);

        // Send order to backend
        const response = await axios.post('http://localhost:8080/api/orders', orderData, {
          headers: {
            'Content-Type': 'application/json'
          }
        });
        
        console.log("Order creation successful. Response:", response.data);

        // Clear the cart
        clearCart();

        // Get the order ID from the response
        const orderId = response.data.orderId || response.data.id;
        if (!orderId) {
          console.error("Order created but no order ID in response:", response.data);
          throw new Error("Order ID not found in response");
        }

        // Store order data in localStorage as backup
        localStorage.setItem('lastOrder', JSON.stringify({
          order: response.data,
          timestamp: new Date().getTime()
        }));

        // Navigate to order confirmation with order ID
        navigate(`/order-confirmation/${orderId}`, { 
          state: { 
            orderDetails: response.data,
            customerName: formData.fullName || userData.username,
            email: formData.email || userData.email
          } 
        });

      } catch (parseError) {
        console.error("Error processing user data:", parseError);
        setError(parseError.message || "Error processing user data. Please try logging in again.");
        setLoading(false);
        return;
      }
    } catch (error) {
      console.error("Error creating order:", error);
      
      if (error.response) {
        console.error("Server error data:", error.response.data);
        console.error("Server error status:", error.response.status);
        setError(error.response.data?.error || "Error creating order. Please try again.");
      } else if (error.request) {
        console.error("No response received:", error.request);
        setError("No response from server. Please check your connection and try again.");
      } else {
        console.error("Error setting up request:", error.message);
        setError(error.message || "Error setting up request. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Processing your order...</div>;
  if (error) return <div className="error">{error}</div>;
  if (cart.length === 0) return (
    <div className="checkout-container">
      <h2>Your cart is empty</h2>
      <button onClick={() => navigate('/')} className="place-order-btn">
        Return to Shopping
      </button>
    </div>
  );

  const tax = totalAmount * 0.18;
  const shipping = totalAmount > 500 ? 0 : 50;
  const total = totalAmount + tax + shipping;

  return (
    <div className="checkout-container">
      <h2>Checkout</h2>
      <div className="checkout-grid">
        <div className="checkout-form-container">
          <form className="checkout-form" onSubmit={handleSubmit}>
            <div className="form-section">
              <h3>Personal Information</h3>
              <div className="form-group">
                <label htmlFor="fullName">Full Name</label>
                <input 
                  type="text" 
                  id="fullName" 
                  name="fullName" 
                  value={formData.fullName} 
                  onChange={(e) => setFormData({...formData, fullName: e.target.value})} 
                  placeholder="Enter your full name" 
                  required 
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input 
                  type="email" 
                  id="email" 
                  name="email" 
                  value={formData.email} 
                  onChange={(e) => setFormData({...formData, email: e.target.value})} 
                  placeholder="Enter your email" 
                  required 
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <input 
                  type="tel" 
                  id="phone" 
                  name="phone" 
                  value={formData.phone} 
                  onChange={(e) => setFormData({...formData, phone: e.target.value})} 
                  placeholder="Enter your phone number" 
                  required 
                />
              </div>
            </div>
            
            <div className="form-section">
              <h3>Shipping Address</h3>
              <div className="form-group">
                <label htmlFor="addressLine1">Address Line</label>
                <input 
                  type="text" 
                  id="addressLine1" 
                  name="addressLine1" 
                  value={formData.addressLine1} 
                  onChange={(e) => setFormData({...formData, addressLine1: e.target.value})} 
                  placeholder="Enter your street address" 
                  required 
                />
              </div>

              <div className="form-group">
                <label htmlFor="city">City</label>
                <input 
                  type="text" 
                  id="city" 
                  name="city" 
                  value={formData.city} 
                  onChange={(e) => setFormData({...formData, city: e.target.value})} 
                  placeholder="Enter your city" 
                  required 
                />
              </div>

              <div className="form-group">
                <label htmlFor="state">State</label>
                <input 
                  type="text" 
                  id="state" 
                  name="state" 
                  value={formData.state} 
                  onChange={(e) => setFormData({...formData, state: e.target.value})} 
                  placeholder="Enter your state" 
                  required 
                />
              </div>

              <div className="form-group">
                <label htmlFor="postalCode">Postal Code</label>
                <input 
                  type="text" 
                  id="postalCode" 
                  name="postalCode" 
                  value={formData.postalCode} 
                  onChange={(e) => setFormData({...formData, postalCode: e.target.value})} 
                  placeholder="Enter your postal code" 
                  required 
                />
              </div>

              <div className="form-group">
                <label htmlFor="country">Country</label>
                <input 
                  type="text" 
                  id="country" 
                  name="country" 
                  value={formData.country} 
                  onChange={(e) => setFormData({...formData, country: e.target.value})} 
                  placeholder="Enter your country" 
                  required 
                  disabled
                />
              </div>
            </div>
            
            <div className="form-section">
              <h3>Payment Method</h3>
              <div className="mb-4">
                <div 
                  className="d-flex align-items-center p-3 mb-2 rounded" 
                  style={{ 
                    backgroundColor: formData.paymentMethod === "cod" ? "#f0f7ff" : "#f8f9fa",
                    border: `1px solid ${formData.paymentMethod === "cod" ? "#cce5ff" : "#dee2e6"}`,
                    cursor: "pointer"
                  }}
                  onClick={() => setFormData({...formData, paymentMethod: "cod"})}
                >
                  <input 
                    type="radio" 
                    id="cod" 
                    name="paymentMethod" 
                    value="cod" 
                    checked={formData.paymentMethod === "cod"} 
                    onChange={(e) => setFormData({...formData, paymentMethod: e.target.value})}
                    className="me-3"
                    style={{ cursor: "pointer" }}
                  />
                  <label htmlFor="cod" className="mb-0 w-100" style={{ cursor: "pointer" }}>
                    <span className="fw-bold">Cash on Delivery</span>
                    <p className="text-muted mb-0 small">Pay when your order is delivered</p>
                  </label>
                </div>
                
                <div 
                  className="d-flex align-items-center p-3 mb-2 rounded" 
                  style={{ 
                    backgroundColor: formData.paymentMethod === "credit_card" ? "#f0f7ff" : "#f8f9fa",
                    border: `1px solid ${formData.paymentMethod === "credit_card" ? "#cce5ff" : "#dee2e6"}`,
                    cursor: "pointer"
                  }}
                  onClick={() => setFormData({...formData, paymentMethod: "credit_card"})}
                >
                  <input 
                    type="radio" 
                    id="credit_card" 
                    name="paymentMethod" 
                    value="credit_card" 
                    checked={formData.paymentMethod === "credit_card"} 
                    onChange={(e) => setFormData({...formData, paymentMethod: e.target.value})}
                    className="me-3"
                    style={{ cursor: "pointer" }}
                  />
                  <label htmlFor="credit_card" className="mb-0 w-100" style={{ cursor: "pointer" }}>
                    <span className="fw-bold">Credit Card</span>
                    <p className="text-muted mb-0 small">Pay securely with your credit card</p>
                  </label>
                </div>
              </div>
            </div>
            
            <button type="submit" className="btn btn-primary w-100 py-3 rounded" disabled={loading}>
              {loading ? "Processing..." : "Place Order"}
            </button>
          </form>
        </div>
        
        <div className="order-summary">
          <h3>Order Summary</h3>
          {cart.length === 0 ? (
            <p>Your cart is empty</p>
          ) : (
            <>
              <div className="cart-items">
                {cart.map((item) => (
                  <div className="cart-item" key={`${item.productId}-${item.variantSize || 'no-size'}-${item.variantColor || 'no-color'}`}>
                    <div className="item-details">
                      <h4>{item.name}</h4>
                      {item.variantSize && <p>Size: {item.variantSize}</p>}
                      {item.variantColor && <p>Color: {item.variantColor}</p>}
                      <p>Quantity: {item.quantity}</p>
                    </div>
                    <div className="item-price">
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="summary-totals">
                <div className="summary-line">
                  <span>Subtotal</span>
                  <span>₹{totalAmount.toFixed(2)}</span>
                </div>
                <div className="summary-line">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? "Free" : `₹${shipping.toFixed(2)}`}</span>
                </div>
                <div className="summary-line">
                  <span>Tax (18% GST)</span>
                  <span>₹{tax.toFixed(2)}</span>
                </div>
                <div className="summary-line total">
                  <span>Total</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Checkout;