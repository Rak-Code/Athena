import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Checkout.css";
import axios from "axios";
import { useCart } from "../context/CartContext";
import { getUserAddresses, getDefaultAddress, createAddress } from '../services/AddressService';
import AddressForm from '../components/AddressForm';

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, removeFromCart } = useCart();
  const [totalAmount, setTotalAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedShippingAddressId, setSelectedShippingAddressId] = useState(null);
  const [selectedBillingAddressId, setSelectedBillingAddressId] = useState(null);
  const [useNewShippingAddress, setUseNewShippingAddress] = useState(true);
  const [useNewBillingAddress, setUseNewBillingAddress] = useState(true);

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
    const fetchAddresses = async () => {
      const user = JSON.parse(localStorage.getItem('user'));
      if (user && user.userId) {
        try {
          const addresses = await getUserAddresses(user.userId);
          setSavedAddresses(addresses);
          
          const defaultAddress = addresses.find(addr => addr.default);
          if (defaultAddress) {
            setSelectedShippingAddressId(defaultAddress.id);
            setSelectedBillingAddressId(defaultAddress.id);
            setUseNewShippingAddress(false);
            setUseNewBillingAddress(false);
            
            if (defaultAddress.addressType === 'SHIPPING' || defaultAddress.addressType === 'BOTH') {
              setFormData(prev => ({
                ...prev,
                addressLine1: defaultAddress.addressLine1,
                addressLine2: defaultAddress.addressLine2 || '',
                city: defaultAddress.city,
                state: defaultAddress.state,
                postalCode: defaultAddress.postalCode,
                country: defaultAddress.country
              }));
            }
            
            if (defaultAddress.addressType === 'BILLING' || defaultAddress.addressType === 'BOTH') {
              setFormData(prev => ({
                ...prev,
                billingAddressLine1: defaultAddress.addressLine1,
                billingAddressLine2: defaultAddress.addressLine2 || '',
                billingCity: defaultAddress.city,
                billingState: defaultAddress.state,
                billingPostalCode: defaultAddress.postalCode,
                billingCountry: defaultAddress.country
              }));
            }
          }
        } catch (error) {
          console.error('Error fetching addresses:', error);
        }
      }
    };
    
    fetchAddresses();

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

  const handleAddressSelect = (addressId, type) => {
    const address = savedAddresses.find(addr => addr.id === addressId);
    if (!address) return;
    
    if (type === 'shipping') {
      setSelectedShippingAddressId(addressId);
      setUseNewShippingAddress(false);
      setFormData(prev => ({
        ...prev,
        addressLine1: address.addressLine1,
        addressLine2: address.addressLine2 || '',
        city: address.city,
        state: address.state,
        postalCode: address.postalCode,
        country: address.country
      }));
    } else {
      setSelectedBillingAddressId(addressId);
      setUseNewBillingAddress(false);
      setFormData(prev => ({
        ...prev,
        billingAddressLine1: address.addressLine1,
        billingAddressLine2: address.addressLine2 || '',
        billingCity: address.city,
        billingState: address.state,
        billingPostalCode: address.postalCode,
        billingCountry: address.country
      }));
    }
  };

  const clearCart = () => {
    [...cart].forEach(item => {
      removeFromCart(item.id);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const shippingAddress = {
      addressLine1: formData.addressLine1,
      addressLine2: formData.addressLine2,
      city: formData.city,
      state: formData.state,
      postalCode: formData.postalCode,
      country: formData.country
    };
    
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
      setError(null);
      
      const user = JSON.parse(localStorage.getItem('user'));
      if (user && user.userId) {
        if (useNewShippingAddress) {
          try {
            await createAddress(user.userId, {
              ...shippingAddress,
              addressType: formData.sameAsBilling ? 'BOTH' : 'SHIPPING'
            });
          } catch (err) {
            console.error('Error saving shipping address:', err);
          }
        }
        
        if (!formData.sameAsBilling && useNewBillingAddress) {
          try {
            await createAddress(user.userId, {
              ...billingAddress,
              addressType: 'BILLING'
            });
          } catch (err) {
            console.error('Error saving billing address:', err);
          }
        }
      }
      
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
      
      const response = await axios.post("http://localhost:8080/api/orders", orderData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      console.log("Order creation response:", response.data);
      console.log("Response data type:", typeof response.data);
      console.log("Response data keys:", Object.keys(response.data));
      console.log("Full response object:", response);
      
      // Dump the entire response for debugging
      console.log("Response status:", response.status);
      console.log("Response headers:", response.headers);
      
      setLoading(false);
      clearCart();
      
      // Enhanced extraction of orderId from the response data
      let orderId = null;
      
      // Try multiple approaches to extract the order ID
      if (response.data) {
        // Direct property access - most reliable method
        if (response.data.orderId) {
          orderId = response.data.orderId;
          console.log("Found orderId directly:", orderId);
        } else if (response.data.id) {
          orderId = response.data.id;
          console.log("Found id directly:", orderId);
        } 
        // Skip the JSON.parse attempt since it's causing errors
        
        // If we still don't have an orderId, try regex on the stringified response
        if (!orderId && typeof response.data === 'object') {
          try {
            // Convert to string safely with a circular reference handler
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
            
            const safeJsonString = JSON.stringify(response.data, getCircularReplacer());
            console.log("Safe JSON string for regex:", safeJsonString.substring(0, 100) + "...");
            
            // Look for orderId pattern
            const orderIdMatch = safeJsonString.match(/"orderId"\s*:\s*(\d+)/);
            if (orderIdMatch && orderIdMatch[1]) {
              orderId = parseInt(orderIdMatch[1], 10);
              console.log("Found orderId via regex:", orderId);
            } 
            // If no orderId, look for id pattern
            else {
              const idMatch = safeJsonString.match(/"id"\s*:\s*(\d+)/);
              if (idMatch && idMatch[1]) {
                orderId = parseInt(idMatch[1], 10);
                console.log("Found id via regex:", orderId);
              }
            }
          } catch (regexErr) {
            console.error("Error in regex extraction:", regexErr);
          }
        }
      }
      
      console.log("Final extracted orderId:", orderId);
      
      if (orderId) {
        console.log("Navigating to order confirmation with ID:", orderId);
        
        // Store the order data in localStorage as a fallback
        try {
          // Create a simplified version of the order to avoid circular references
          const simplifiedOrder = {
            orderId: orderId,
            totalAmount: response.data.totalAmount,
            status: response.data.status,
            orderDate: response.data.orderDate,
            paymentMethod: response.data.paymentMethod,
            orderItems: cart.map(item => ({
              productId: item.id,
              name: item.name,
              price: item.price,
              quantity: item.quantity,
              image: item.image
            }))
          };
          
          // Safely extract user information
          if (response.data.user) {
            simplifiedOrder.customerName = response.data.user.username;
            simplifiedOrder.userId = response.data.user.userId || response.data.user.id;
          }
          
          // Handle shipping and billing addresses
          if (shippingAddress) {
            simplifiedOrder.shippingAddress = shippingAddress;
          }
          
          if (billingAddress) {
            simplifiedOrder.billingAddress = billingAddress;
          } else if (formData.sameAsShipping) {
            simplifiedOrder.billingAddress = shippingAddress;
          }
          
          localStorage.setItem('lastOrder', JSON.stringify({
            order: simplifiedOrder,
            timestamp: new Date().getTime()
          }));
        } catch (storageErr) {
          console.error("Error storing order in localStorage:", storageErr);
          
          // Fallback: try to store just the order ID if the full object fails
          try {
            localStorage.setItem('lastOrder', JSON.stringify({
              order: { orderId: orderId },
              timestamp: new Date().getTime()
            }));
          } catch (fallbackErr) {
            console.error("Error storing fallback order data:", fallbackErr);
          }
        }
        
        // Pass the orderId in both the URL and the location state as a fallback
        navigate(`/order-confirmation/${orderId}`, { state: { orderId } });
      } else {
        console.error("Order created but no order ID returned:", response.data);
        setError("Order was placed but we couldn't retrieve the order details. Please check your orders in your profile.");
      }
    } catch (err) {
      setLoading(false);
      console.error("Error placing order:", err);
      
      if (err.response) {
        if (typeof err.response.data === 'string') {
          setError(err.response.data);
        } else if (err.response.data && err.response.data.message) {
          setError(err.response.data.message);
        } else {
          setError(`Server error (${err.response.status}). Please try again.`);
        }
      } else if (err.request) {
        setError("No response from server. Please check your internet connection and try again.");
      } else {
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
              
              {savedAddresses.length > 0 && (
                <div className="saved-addresses mb-4">
                  <div className="form-group mb-3">
                    <div className="d-flex align-items-center mb-2">
                      <input
                        type="radio"
                        id="useNewShippingAddress"
                        name="shippingAddressOption"
                        checked={useNewShippingAddress}
                        onChange={() => setUseNewShippingAddress(true)}
                        className="me-2"
                      />
                      <label htmlFor="useNewShippingAddress">Use a new address</label>
                    </div>
                    
                    <div className="d-flex align-items-center">
                      <input
                        type="radio"
                        id="useSavedShippingAddress"
                        name="shippingAddressOption"
                        checked={!useNewShippingAddress}
                        onChange={() => setUseNewShippingAddress(false)}
                        className="me-2"
                      />
                      <label htmlFor="useSavedShippingAddress">Use a saved address</label>
                    </div>
                  </div>
                  
                  {!useNewShippingAddress && (
                    <div className="saved-address-select mb-4">
                      <select
                        className="form-select"
                        value={selectedShippingAddressId || ''}
                        onChange={(e) => handleAddressSelect(Number(e.target.value), 'shipping')}
                      >
                        <option value="">Select an address</option>
                        {savedAddresses
                          .filter(addr => addr.addressType === 'SHIPPING' || addr.addressType === 'BOTH')
                          .map(addr => (
                            <option key={addr.id} value={addr.id}>
                              {addr.addressLine1}, {addr.city}, {addr.state} {addr.postalCode}
                              {addr.default ? ' (Default)' : ''}
                            </option>
                          ))}
                      </select>
                    </div>
                  )}
                </div>
              )}
              
              {useNewShippingAddress && (
                <>
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
                </>
              )}
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
                  
                  {savedAddresses.length > 0 && (
                    <div className="saved-addresses mb-4">
                      <div className="form-group mb-3">
                        <div className="d-flex align-items-center mb-2">
                          <input
                            type="radio"
                            id="useNewBillingAddress"
                            name="billingAddressOption"
                            checked={useNewBillingAddress}
                            onChange={() => setUseNewBillingAddress(true)}
                            className="me-2"
                          />
                          <label htmlFor="useNewBillingAddress">Use a new address</label>
                        </div>
                        
                        <div className="d-flex align-items-center">
                          <input
                            type="radio"
                            id="useSavedBillingAddress"
                            name="billingAddressOption"
                            checked={!useNewBillingAddress}
                            onChange={() => setUseNewBillingAddress(false)}
                            className="me-2"
                          />
                          <label htmlFor="useSavedBillingAddress">Use a saved address</label>
                        </div>
                      </div>
                      
                      {!useNewBillingAddress && (
                        <div className="saved-address-select mb-4">
                          <select
                            className="form-select"
                            value={selectedBillingAddressId || ''}
                            onChange={(e) => handleAddressSelect(Number(e.target.value), 'billing')}
                          >
                            <option value="">Select an address</option>
                            {savedAddresses
                              .filter(addr => addr.addressType === 'BILLING' || addr.addressType === 'BOTH')
                              .map(addr => (
                                <option key={addr.id} value={addr.id}>
                                  {addr.addressLine1}, {addr.city}, {addr.state} {addr.postalCode}
                                  {addr.default ? ' (Default)' : ''}
                                </option>
                              ))}
                          </select>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {useNewBillingAddress && (
                    <>
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
                    </>
                  )}
                </div>
              )}
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
                    onChange={handleInputChange}
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
                    onChange={handleInputChange}
                    className="me-3"
                    style={{ cursor: "pointer" }}
                  />
                  <label htmlFor="credit_card" className="mb-0 w-100" style={{ cursor: "pointer" }}>
                    <span className="fw-bold">Credit Card</span>
                    <p className="text-muted mb-0 small">Pay securely with your credit card</p>
                  </label>
                </div>
                
                <div 
                  className="d-flex align-items-center p-3 mb-2 rounded" 
                  style={{ 
                    backgroundColor: formData.paymentMethod === "upi" ? "#f0f7ff" : "#f8f9fa",
                    border: `1px solid ${formData.paymentMethod === "upi" ? "#cce5ff" : "#dee2e6"}`,
                    cursor: "pointer"
                  }}
                  onClick={() => setFormData({...formData, paymentMethod: "upi"})}
                >
                  <input 
                    type="radio" 
                    id="upi" 
                    name="paymentMethod" 
                    value="upi" 
                    checked={formData.paymentMethod === "upi"} 
                    onChange={handleInputChange}
                    className="me-3"
                    style={{ cursor: "pointer" }}
                  />
                  <label htmlFor="upi" className="mb-0 w-100" style={{ cursor: "pointer" }}>
                    <span className="fw-bold">UPI</span>
                    <p className="text-muted mb-0 small">Pay using UPI apps like Google Pay, PhonePe, etc.</p>
                  </label>
                </div>
              </div>
              
              {formData.paymentMethod === "credit_card" && (
                <div className="p-3 mb-3 rounded" style={{ backgroundColor: "#f8f9fa", border: "1px solid #dee2e6" }}>
                  <div className="mb-3">
                    <label htmlFor="cardNumber" className="form-label">Card Number</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      id="cardNumber" 
                      name="cardNumber" 
                      placeholder="Card number" 
                      maxLength="16" 
                    />
                  </div>
                  
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label htmlFor="expiryDate" className="form-label">Expiry Date</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        id="expiryDate" 
                        name="expiryDate" 
                        placeholder="MM/YY" 
                        maxLength="5" 
                      />
                    </div>
                    
                    <div className="col-md-6 mb-3">
                      <label htmlFor="cvv" className="form-label">CVV</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        id="cvv" 
                        name="cvv" 
                        placeholder="CVV" 
                        maxLength="3" 
                      />
                    </div>
                  </div>
                </div>
              )}
              
              {formData.paymentMethod === "upi" && (
                <div className="p-3 mb-3 rounded" style={{ backgroundColor: "#f8f9fa", border: "1px solid #dee2e6" }}>
                  <div className="mb-3">
                    <label htmlFor="upiId" className="form-label">UPI ID</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      id="upiId" 
                      name="upiId" 
                      placeholder="yourname@bankname" 
                    />
                  </div>
                </div>
              )}
            </div>
            
            <button type="submit" className="btn btn-primary w-100 py-3 rounded">Place Order</button>
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