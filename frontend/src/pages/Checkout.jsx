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
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India",
    sameAsBilling: true,
    billingAddressLine1: "",
    billingAddressLine2: "",
    billingCity: "",
    billingState: "",
    billingPostalCode: "",
    billingCountry: "India",
    paymentMethod: "cod"
  });

  useEffect(() => {
    // Calculate total from cart items from context
    calculateTotal();
  }, [cart]);

  const calculateTotal = () => {
    const total = cart.reduce((sum, item) => {
      return sum + (item.price * item.quantity);
    }, 0);
    setTotalAmount(total);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === "checkbox") {
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Function to clear the cart
  const clearCart = () => {
    // Remove each item from the cart
    [...cart].forEach(item => {
      removeFromCart(item.id);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Prepare shipping address
    const shippingAddress = {
      addressLine1: formData.addressLine1,
      addressLine2: formData.addressLine2,
      city: formData.city,
      state: formData.state,
      postalCode: formData.postalCode,
      country: formData.country
    };
    
    // Prepare billing address
    const billingAddress = formData.sameAsBilling
      ? shippingAddress
      : {
          addressLine1: formData.billingAddressLine1,
          addressLine2: formData.billingAddressLine2,
          city: formData.billingCity,
          state: formData.billingState,
          postalCode: formData.billingPostalCode,
          country: formData.billingCountry
        };
    
    try {
      setLoading(true);
      setError(null); // Clear any previous errors
      
      const orderData = {
        customerName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        shippingAddress,
        billingAddress,
        paymentMethod: formData.paymentMethod,
        cartItems: cart.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image
        }))
      };
      
      console.log("Sending order data:", orderData);
      
      const response = await axios.post("http://localhost:8080/api/orders", orderData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      console.log("Order response:", response.data);
      
      setLoading(false);
      
      // Clear the cart after successful order
      clearCart();
      
      // Navigate to order confirmation page
      navigate(`/order-confirmation/${response.data.orderId}`);
    } catch (err) {
      setLoading(false);
      console.error("Error placing order:", err);
      
      // Set a more detailed error message
      if (err.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error("Error response data:", err.response.data);
        console.error("Error response status:", err.response.status);
        
        if (typeof err.response.data === 'string') {
          setError(err.response.data);
        } else if (err.response.data && err.response.data.message) {
          setError(err.response.data.message);
        } else {
          setError(`Server error (${err.response.status}). Please try again.`);
        }
      } else if (err.request) {
        // The request was made but no response was received
        console.error("Error request:", err.request);
        setError("No response from server. Please check your internet connection and try again.");
      } else {
        // Something happened in setting up the request that triggered an Error
        setError("Failed to place order. Please try again.");
      }
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

  // Calculate the tax, shipping and total
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
                  onChange={handleInputChange}
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
                  onChange={handleInputChange}
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
                  onChange={handleInputChange}
                  placeholder="Enter your phone number" 
                  required 
                />
              </div>
            </div>
            
            <div className="form-section">
              <h3>Shipping Address</h3>
              <div className="form-group">
                <label htmlFor="addressLine1">Address Line 1</label>
                <input 
                  type="text" 
                  id="addressLine1" 
                  name="addressLine1" 
                  value={formData.addressLine1} 
                  onChange={handleInputChange}
                  placeholder="Street address, P.O. box" 
                  required 
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="addressLine2">Address Line 2</label>
                <input 
                  type="text" 
                  id="addressLine2" 
                  name="addressLine2" 
                  value={formData.addressLine2} 
                  onChange={handleInputChange}
                  placeholder="Apartment, suite, unit, building, floor, etc." 
                />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="city">City</label>
                  <input 
                    type="text" 
                    id="city" 
                    name="city" 
                    value={formData.city} 
                    onChange={handleInputChange}
                    placeholder="City" 
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
                    onChange={handleInputChange}
                    placeholder="State/Province" 
                    required 
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="postalCode">Postal Code</label>
                  <input 
                    type="text" 
                    id="postalCode" 
                    name="postalCode" 
                    value={formData.postalCode} 
                    onChange={handleInputChange}
                    placeholder="Postal/ZIP code" 
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
                    onChange={handleInputChange}
                    placeholder="Country" 
                    required 
                  />
                </div>
              </div>
            </div>
            
            <div className="form-section">
              <div className="form-group checkbox-group">
                <input 
                  type="checkbox" 
                  id="sameAsBilling" 
                  name="sameAsBilling" 
                  checked={formData.sameAsBilling} 
                  onChange={handleInputChange} 
                />
                <label htmlFor="sameAsBilling">Billing address same as shipping address</label>
              </div>
              
              {!formData.sameAsBilling && (
                <div className="billing-address">
                  <h3>Billing Address</h3>
                  <div className="form-group">
                    <label htmlFor="billingAddressLine1">Address Line 1</label>
                    <input 
                      type="text" 
                      id="billingAddressLine1" 
                      name="billingAddressLine1" 
                      value={formData.billingAddressLine1} 
                      onChange={handleInputChange}
                      placeholder="Street address, P.O. box" 
                      required={!formData.sameAsBilling} 
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="billingAddressLine2">Address Line 2</label>
                    <input 
                      type="text" 
                      id="billingAddressLine2" 
                      name="billingAddressLine2" 
                      value={formData.billingAddressLine2} 
                      onChange={handleInputChange}
                      placeholder="Apartment, suite, unit, building, floor, etc." 
                    />
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="billingCity">City</label>
                      <input 
                        type="text" 
                        id="billingCity" 
                        name="billingCity" 
                        value={formData.billingCity} 
                        onChange={handleInputChange}
                        placeholder="City" 
                        required={!formData.sameAsBilling} 
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="billingState">State</label>
                      <input 
                        type="text" 
                        id="billingState" 
                        name="billingState" 
                        value={formData.billingState} 
                        onChange={handleInputChange}
                        placeholder="State/Province" 
                        required={!formData.sameAsBilling} 
                      />
                    </div>
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="billingPostalCode">Postal Code</label>
                      <input 
                        type="text" 
                        id="billingPostalCode" 
                        name="billingPostalCode" 
                        value={formData.billingPostalCode} 
                        onChange={handleInputChange}
                        placeholder="Postal/ZIP code" 
                        required={!formData.sameAsBilling} 
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="billingCountry">Country</label>
                      <input 
                        type="text" 
                        id="billingCountry" 
                        name="billingCountry" 
                        value={formData.billingCountry} 
                        onChange={handleInputChange}
                        placeholder="Country" 
                        required={!formData.sameAsBilling} 
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="form-section">
              <h3>Payment Method</h3>
              <div className="payment-options">
                <div className="form-group radio-group">
                  <input 
                    type="radio" 
                    id="cod" 
                    name="paymentMethod" 
                    value="cod" 
                    checked={formData.paymentMethod === "cod"} 
                    onChange={handleInputChange}
                  />
                  <label htmlFor="cod">Cash on Delivery</label>
                </div>
                
                <div className="form-group radio-group">
                  <input 
                    type="radio" 
                    id="credit_card" 
                    name="paymentMethod" 
                    value="credit_card" 
                    checked={formData.paymentMethod === "credit_card"} 
                    onChange={handleInputChange}
                  />
                  <label htmlFor="credit_card">Credit Card</label>
                </div>
                
                <div className="form-group radio-group">
                  <input 
                    type="radio" 
                    id="upi" 
                    name="paymentMethod" 
                    value="upi" 
                    checked={formData.paymentMethod === "upi"} 
                    onChange={handleInputChange}
                  />
                  <label htmlFor="upi">UPI</label>
                </div>
              </div>
              
              {formData.paymentMethod === "credit_card" && (
                <div className="credit-card-details">
                  <div className="form-group">
                    <label htmlFor="cardNumber">Card Number</label>
                    <input type="text" id="cardNumber" name="cardNumber" placeholder="Card number" maxLength="16" />
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="expiryDate">Expiry Date</label>
                      <input type="text" id="expiryDate" name="expiryDate" placeholder="MM/YY" maxLength="5" />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="cvv">CVV</label>
                      <input type="text" id="cvv" name="cvv" placeholder="CVV" maxLength="3" />
                    </div>
                  </div>
                </div>
              )}
              
              {formData.paymentMethod === "upi" && (
                <div className="upi-details">
                  <div className="form-group">
                    <label htmlFor="upiId">UPI ID</label>
                    <input type="text" id="upiId" name="upiId" placeholder="yourname@bankname" />
                  </div>
                </div>
              )}
            </div>
            
            <button type="submit" className="place-order-btn">Place Order</button>
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
                      <p>Size: {item.variantSize}, Color: {item.variantColor}</p>
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
                  <span>₹{shipping === 0 ? "Free" : shipping.toFixed(2)}</span>
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
