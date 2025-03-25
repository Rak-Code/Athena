import React from "react";
import { Container, Row, Col, Card, Button, Form } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { FaTrash } from "react-icons/fa";
import { useCart } from "../context/CartContext";
import Footer from "../components/Footer";

const Cart = () => {
  const { cart, updateCartItem, removeFromCart } = useCart();
  const navigate = useNavigate();

  const calculateSubtotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const handleQuantityChange = (id, newQuantity) => {
    if (newQuantity > 0) {
      updateCartItem(id, newQuantity);
    }
  };

  const handleCheckout = () => {
    // Check if user is logged in by looking for user data in localStorage
    const userData = localStorage.getItem('user');
    if (!userData) {
      // If not logged in, redirect to login page with return URL
      navigate('/login', { state: { from: '/checkout' } });
      return;
    }
    // If logged in, proceed to checkout
    navigate('/checkout');
  };

  if (cart.length === 0) {
    return (
      <Container className="py-5 text-center">
        <h2 className="mb-4">Your Cart is Empty</h2>
        <p className="mb-4">Looks like you haven't added any products to your cart yet.</p>
        <Link to="/" className="btn btn-primary">
          Continue Shopping
        </Link>
      </Container>
    );
  }

  return (
    <Container className="py-5 h-full">
      <h2 className="mb-4 fw-bold">Shopping Cart</h2>
      
      <Row>
        <Col lg={8}>
          <Card className="mb-4 border-0 shadow-sm">
            <Card.Body>
              {cart.map((item) => (
                <Row key={item.productId} className="mb-4 align-items-center border-bottom pb-3">
                  <Col xs={3} md={2}>
                    <img 
                      src={item.imageUrl || "https://via.placeholder.com/150"} 
                      alt={item.name} 
                      className="img-fluid rounded"
                    />
                  </Col>
                  
                  <Col xs={9} md={4}>
                    <h5>{item.name}</h5>
                    <p className="text-muted mb-0">
                      Size: {item.variantSize}, Color: {item.variantColor}
                    </p>
                  </Col>
                  
                  <Col xs={6} sm={3} md={2} className="mt-2 mt-sm-0">
                    <div className="d-flex align-items-center">
                      <Button 
                        variant="outline-secondary" 
                        size="sm"
                        onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                      >
                        -
                      </Button>
                      <Form.Control
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => handleQuantityChange(item.productId, parseInt(e.target.value))}
                        className="mx-2 text-center"
                        style={{ width: "60px" }}
                      />
                      <Button 
                        variant="outline-secondary" 
                        size="sm"
                        onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                      >
                        +
                      </Button>
                    </div>
                  </Col>
                  
                  <Col xs={4} sm={3} md={2} className="mt-2 mt-sm-0">
                    <div className="fw-bold">₹{item.price * item.quantity}</div>
                  </Col>
                  
                  <Col xs={2} sm={1} className="text-end mt-2 mt-sm-0">
                    <Button 
                      variant="link" 
                      className="text-danger p-0"
                      onClick={() => removeFromCart(item.productId)}
                    >
                      <FaTrash />
                    </Button>
                  </Col>
                </Row>
              ))}
            </Card.Body>
          </Card>
          
          <div className="d-flex justify-content-between align-items-center mb-4">
            <Link to="/" className="btn btn-outline-primary">
              Continue Shopping
            </Link>
          </div>
        </Col>
        
        <Col lg={4}>
          <Card className="border-0 shadow-sm">
            <Card.Body>
              <h4 className="mb-4">Order Summary</h4>
              
              <div className="d-flex justify-content-between mb-2">
                <span>Subtotal</span>
                <span>₹{calculateSubtotal()}</span>
              </div>
              
              <div className="d-flex justify-content-between mb-2">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              
              <hr />
              
              <div className="d-flex justify-content-between mb-4">
                <span className="fw-bold">Total</span>
                <span className="fw-bold">₹{calculateSubtotal()}</span>
              </div>
              
              <Button 
                variant="primary" 
                className="w-100 py-2"
                onClick={handleCheckout}
              >
                Proceed to Checkout
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <div className="mt-5 h-full">
        <Footer />
      </div>
      
    </Container>
  );
};

export default Cart;