import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Checkout.css";
import axios from "axios";
import { useCart } from "../context/CartContext";

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, removeFromCart } = useCart();
  const [totalAmount, setTotalAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
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

  useEffect(() => calculateTotal(), [cart]);

  const calculateTotal = () => {
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    setTotalAmount(total);
  };

  const clearCart = () => cart.forEach(item => removeFromCart(item.productId));

  const handlePayment = async (total, orderId) => {
    try {
      console.log("Creating Razorpay order for amount:", total);
      
      const response = await axios.post(
        `http://localhost:8080/api/payments/create-order?amount=${total.toFixed(2)}`,
        null,
        {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log("Payment creation response:", response.data);
      
      if (!response.data || !response.data.id) {
        throw new Error("Invalid response from payment creation");
      }

      // Check if Razorpay is loaded
      if (typeof window.Razorpay === 'undefined') {
        throw new Error("Razorpay SDK not loaded. Please check your internet connection.");
      }

      const options = {
        key: "rzp_test_w81KIiv8IbbUDv",
        amount: response.data.amount, // Amount is now in paise from backend
        currency: "INR",
        name: "Athena Store",
        description: `Order #${orderId}`,
        order_id: response.data.id,
        handler: async function (paymentResponse) {
          try {
            console.log("Payment success response:", paymentResponse);
            
            const updateResponse = await axios.post(
              "http://localhost:8080/api/payments/update",
              {
                orderId: orderId,
                paymentId: paymentResponse.razorpay_payment_id,
                razorpayOrderId: response.data.id,
                status: "COMPLETED",
                amount: total
              },
              {
                headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json'
                }
              }
            );

            console.log("Payment update response:", updateResponse.data);
            
            if (updateResponse.data && updateResponse.data.status === "success") {
              clearCart();
              navigate(`/order-confirmation/${orderId}`);
            } else {
              throw new Error("Failed to update payment status");
            }
          } catch (error) {
            console.error("Error updating payment status:", error.response?.data || error);
            setError("Payment was successful but failed to update order status. Please contact support.");
          }
        },
        prefill: {
          name: formData.fullName || "",
          email: formData.email || "",
          contact: formData.phone || "",
        },
        theme: { 
          color: "#4a6eb5" 
        },
        modal: {
          ondismiss: function() {
            console.log("Payment modal closed");
            setError("Payment cancelled by user");
          }
        }
      };

      try {
        const razorpay = new window.Razorpay(options);
        razorpay.open();
      } catch (error) {
        console.error("Error initializing Razorpay:", error);
        throw new Error("Failed to initialize payment gateway. Please try again.");
      }
    } catch (error) {
      console.error("Payment Error Details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      
      let errorMessage = "Failed to initiate payment. ";
      if (error.message.includes("Razorpay SDK not loaded")) {
        errorMessage += "Payment gateway is not available. Please check your internet connection.";
      } else if (error.response?.status === 500) {
        errorMessage += "Internal server error. Please try again later.";
      } else if (error.response?.data?.message) {
        errorMessage += error.response.data.message;
      } else {
        errorMessage += error.message || "Please try again later.";
      }
      
      setError(errorMessage);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { addressLine1, city, state, postalCode, country, paymentMethod } = formData;
      if (!addressLine1 || !city || !state || !postalCode || !country) {
        throw new Error("Please fill in all address fields");
      }

      const userStr = localStorage.getItem('user');
      if (!userStr) throw new Error("Please log in to place an order");
      
      const userData = JSON.parse(userStr);
      const userId = parseInt(userData.id || userData.userId);
      if (isNaN(userId)) throw new Error("Invalid user ID format");

      const tax = totalAmount * 0.18;
      const shipping = totalAmount > 500 ? 0 : 50;
      const total = totalAmount + tax + shipping;

    const orderData = {
        userId,
        customerName: formData.fullName || userData.username,
        email: formData.email || userData.email,
      phone: formData.phone,
        shippingAddress: `${addressLine1}, ${city}, ${state}, ${postalCode}, ${country}`,
        billingAddress: `${addressLine1}, ${city}, ${state}, ${postalCode}, ${country}`,
        paymentMethod,
        totalAmount: total,
      cartItems: cart.map(item => ({
          productId: parseInt(item.productId),
        name: item.name,
          price: parseFloat(item.price),
          quantity: parseInt(item.quantity),
          variantSize: item.variantSize || null,
          variantColor: item.variantColor || null
      }))
    };

      const response = await axios.post('http://localhost:8080/api/orders', orderData);
      const orderId = response.data.orderId || response.data.id;

      if (paymentMethod === "razorpay") {
        await handlePayment(total, orderId);
      } else {
        // For COD orders
        clearCart();
        navigate(`/order-confirmation/${orderId}`, { 
          state: { 
            orderDetails: response.data,
            customerName: orderData.customerName,
            email: orderData.email
          } 
        });
      }
    } catch (error) {
      console.error("Checkout Error:", error);
      setError(error.response?.data?.message || error.message || "An error occurred during checkout");
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
              {["fullName", "email", "phone"].map(field => (
                <div className="form-group" key={field}>
                  <label htmlFor={field}>{field.replace(/([A-Z])/g, ' $1').trim()}</label>
                <input 
                    type={field === 'email' ? 'email' : field === 'phone' ? 'tel' : 'text'}
                    id={field}
                    value={formData[field]}
                    onChange={(e) => setFormData({...formData, [field]: e.target.value})}
                    placeholder={`Enter your ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`}
                  required 
                />
                </div>
              ))}
              </div>
              
            <div className="form-section">
              <h3>Shipping Address</h3>
              {["addressLine1", "city", "state", "postalCode"].map(field => (
                <div className="form-group" key={field}>
                  <label htmlFor={field}>{field.replace(/([A-Z])/g, ' $1').trim()}</label>
                <input 
                    type="text"
                    id={field}
                    value={formData[field]}
                    onChange={(e) => setFormData({...formData, [field]: e.target.value})}
                    placeholder={`Enter your ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`}
                  required 
                />
              </div>
              ))}
              <div className="form-group">
                <label htmlFor="country">Country</label>
                <input 
                  type="text"
                  id="country"
                  value={formData.country}
                  disabled
                />
              </div>
            </div>
            
            <div className="form-section">
              <h3>Payment Method</h3>
              <div className="mb-4">
                {[
                  { value: "cod", label: "Cash on Delivery", desc: "Pay when delivered" },
                  { value: "razorpay", label: "Razorpay", desc: "Secure online payments" }
                ].map(method => (
                <div 
                    key={method.value}
                  className="d-flex align-items-center p-3 mb-2 rounded" 
                  style={{ 
                      backgroundColor: formData.paymentMethod === method.value ? "#f0f7ff" : "#f8f9fa",
                      border: `1px solid ${formData.paymentMethod === method.value ? "#cce5ff" : "#dee2e6"}`,
                    cursor: "pointer"
                  }}
                    onClick={() => setFormData({...formData, paymentMethod: method.value})}
                >
                  <input 
                    type="radio" 
                      id={method.value} 
                    name="paymentMethod" 
                      value={method.value} 
                      checked={formData.paymentMethod === method.value} 
                      onChange={() => {}} 
                    className="me-3"
                    />
                    <label htmlFor={method.value} className="mb-0 w-100">
                      <span className="fw-bold">{method.label}</span>
                      <p className="text-muted mb-0 small">{method.desc}</p>
                  </label>
                </div>
                ))}
              </div>
            </div>
            
            <button type="submit" className="btn btn-primary w-100 py-3 rounded" disabled={loading}>
              {loading ? "Processing..." : "Place Order"}
            </button>
          </form>
        </div>
        
        <div className="order-summary">
          <h3>Order Summary</h3>
              <div className="cart-items">
            {cart.map(item => (
              <div className="cart-item" key={`${item.productId}-${item.variantSize || 'no-size'}-${item.variantColor || 'no-color'}`}>
                    <div className="item-details">
                      <h4>{item.name}</h4>
                      {item.variantSize && <p>Size: {item.variantSize}</p>}
                      {item.variantColor && <p>Color: {item.variantColor}</p>}
                      <p>Quantity: {item.quantity}</p>
                    </div>
                <div className="item-price">₹{(item.price * item.quantity).toFixed(2)}</div>
                  </div>
                ))}
              </div>
              
              <div className="summary-totals">
            {[
              { label: "Subtotal", value: totalAmount },
              { label: "Shipping", value: shipping, format: v => v === 0 ? "Free" : `₹${v.toFixed(2)}` },
              { label: "Tax (18% GST)", value: tax },
              { label: "Total", value: total, isTotal: true }
            ].map(({ label, value, format, isTotal }) => (
              <div className={`summary-line ${isTotal ? 'total' : ''}`} key={label}>
                <span>{label}</span>
                <span>{format ? format(value) : `₹${value.toFixed(2)}`}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;