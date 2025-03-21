import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Alert } from 'react-bootstrap';
import { FaTrash, FaShoppingCart } from 'react-icons/fa';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import Footer from '../components/Footer';

const Wishlist = () => {
  const { wishlistItems, removeFromWishlist, clearWishlist, user } = useWishlist();
  const { addToCart } = useCart();
  const [debugInfo, setDebugInfo] = useState('');

  useEffect(() => {
    console.log('Wishlist items in component:', wishlistItems);
    
    // Create a debug string with item details
    if (wishlistItems && wishlistItems.length > 0) {
      const itemDetails = wishlistItems.map(item => {
        return `Item: ${item.name || 'No name'}, ID: ${item.id || 'No ID'}, ProductID: ${item.productId || 'No ProductID'}`;
      }).join('\n');
      
      setDebugInfo(`Found ${wishlistItems.length} items:\n${itemDetails}`);
    } else {
      setDebugInfo('No wishlist items found');
    }
  }, [wishlistItems]);

  const handleAddToCart = (product) => {
    console.log('Adding to cart:', product);
    addToCart(product, { size: 'M', color: 'Black' }, 1);
    removeFromWishlist(product.productId);
  };

  if (!user) {
    return (
      <Container className="py-5">
        <h2 className="text-center mb-4">My Wishlist</h2>
        <div className="text-center py-5">
          <h4>Please log in to view your wishlist</h4>
          <Link to="/login" className="btn btn-primary mt-3">Log In</Link>
        </div>
        <Footer />
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <h2 className="text-center mb-4">My Wishlist</h2>
      
      {wishlistItems.length === 0 ? (
        <div className="text-center py-5">
          <h4>Your wishlist is empty</h4>
          <p className="text-muted">Add items to your wishlist to save them for later</p>
          <Link to="/" className="btn btn-primary mt-3">Continue Shopping</Link>
        </div>
      ) : (
        <>
          <div className="d-flex justify-content-end mb-3">
            <Button 
              variant="outline-danger" 
              size="sm"
              onClick={clearWishlist}
            >
              Clear Wishlist
            </Button>
          </div>
          
          <Row xs={1} md={2} lg={4} className="g-4">
            {wishlistItems.map(item => {
              console.log('Rendering wishlist item:', item);
              return (
                <Col key={item.productId || item.id}>
                  <Card className="h-100 shadow-sm" style={{ transition: 'transform 0.3s ease, box-shadow 0.3s ease' }} 
                    onMouseOver={(e) => {
                      e.currentTarget.style.transform = 'translateY(-5px)';
                      e.currentTarget.style.boxShadow = '0 10px 20px rgba(0,0,0,0.1)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 0.125rem 0.25rem rgba(0, 0, 0, 0.075)';
                    }}
                  >
                    <Link to={`/product/${item.productId || item.id}`}>
                      <Card.Img 
                        variant="top" 
                        src={item.imageUrl} 
                        alt={item.name}
                        style={{ height: '200px', objectFit: 'cover' }}
                      />
                    </Link>
                    <Card.Body>
                      <Link to={`/product/${item.productId || item.id}`} className="text-decoration-none">
                        <Card.Title className="text-dark">{item.name}</Card.Title>
                      </Link>
                      <Card.Text className="text-primary fw-bold">₹{item.price}</Card.Text>
                      <div className="d-flex justify-content-between mt-3">
                        <Button 
                          variant="outline-danger" 
                          size="sm"
                          onClick={() => removeFromWishlist(item.productId || item.id)}
                        >
                          <FaTrash /> Remove
                        </Button>
                        <Button 
                          variant="primary" 
                          className="px-3"
                          style={{ 
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                            transition: 'all 0.3s ease'
                          }}
                          onMouseOver={(e) => {
                            e.currentTarget.style.transform = 'scale(1.05)';
                            e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)';
                          }}
                          onMouseOut={(e) => {
                            e.currentTarget.style.transform = 'scale(1)';
                            e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
                          }}
                          onClick={() => handleAddToCart(item)}
                        >
                          <FaShoppingCart className="me-2" /> Add to Cart
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              );
            })}
          </Row>
        </>
      )}
      <Footer />
    </Container>
  );
};

export default Wishlist;