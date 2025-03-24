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
    cart.forEach(item => removeFromCart(item.id));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Format the shipping and billing addresses
    const formattedAddress = `${formData.addressLine1}, ${formData.city}, ${formData.state}, ${formData.postalCode}, ${formData.country}`;

    const orderData = {
      customerName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      shippingAddress: formattedAddress,
      billingAddress: formattedAddress, // Using the same address for both
      paymentMethod: formData.paymentMethod,
      cartItems: cart.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity
      }))
    };

    console.log("Sending order data:", orderData);

    try {
      const response = await axios.post("http://localhost:8080/api/orders", orderData, {
        withCredentials: true,
        headers: { "Content-Type": "application/json" }
      });

      console.log("Order Response:", response.data);

      if (response.data && response.data.orderId) {
        const orderId = response.data.orderId;
        console.log("Extracted orderId:", orderId);

        // Store order in localStorage as backup
        localStorage.setItem("lastOrder", JSON.stringify({
          orderId,
          totalAmount: response.data.totalAmount,
          status: response.data.status,
          orderDate: response.data.orderDate
        }));

        clearCart();
        navigate(`/order-confirmation/${orderId}`, { state: { orderId } });
      } else {
        console.error("Order created but no order ID returned:", response.data);
        setError("Order was placed but we couldn't retrieve the order details. Please check your orders.");
      }
    } catch (err) {
      console.error("Error placing order:", err);
      setError("Failed to place order. Please try again.");
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
                  <div className="cart-item" key={item.id}>
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