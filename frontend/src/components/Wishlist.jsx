import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { FaTrash, FaShoppingCart } from 'react-icons/fa';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import Footer from '../components/Footer';

const Wishlist = () => {
  const { wishlistItems, removeFromWishlist, removeByUserAndProduct, user } = useWishlist();
  const { addToCart } = useCart();
  const [debugInfo, setDebugInfo] = useState('');

  useEffect(() => {
    console.log("Wishlist Items:", wishlistItems); // Debugging
    // Ensure wishlistItems is an array
    const items = Array.isArray(wishlistItems) ? wishlistItems : [];
    
    if (items.length > 0) {
      const itemDetails = items.map(item => (
        `Item: ${item.product?.name || 'No name'}, ID: ${item.wishlistId || 'No ID'}, ProductID: ${item.product?.productId || 'No ProductID'}`
      )).join('\n');
      setDebugInfo(`Found ${items.length} items:\n${itemDetails}`);
    } else {
      setDebugInfo('No wishlist items found');
    }
  }, [wishlistItems]);

  const handleAddToCart = (product) => {
    addToCart(product, { size: 'M', color: 'Black' }, 1);
    // Fix: removeByUserAndProduct now only expects productId as parameter
    const productId = product.productId || product.id;
    removeByUserAndProduct(productId);
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

  // Ensure wishlistItems is an array
  const safeWishlistItems = Array.isArray(wishlistItems) ? wishlistItems : [];

  return (
    <Container className="py-5">
      <h2 className="text-center mb-4">My Wishlist</h2>
      {safeWishlistItems.length === 0 ? (
        <div className="text-center py-5">
          <h4>Your wishlist is empty</h4>
          <p className="text-muted">Add items to your wishlist to save them for later</p>
          <Link to="/" className="btn btn-primary mt-3">Continue Shopping</Link>
        </div>
      ) : (
        <>
          <Row xs={1} md={2} lg={4} className="g-4">
            {safeWishlistItems.map(item => {
              // Check if item and item.product exist
              if (!item || !item.product) {
                console.log("Invalid wishlist item:", item);
                return null;
              }
              
              return (
                <Col key={item.wishlistId || `item-${Math.random()}`}>
                  <Card className="h-100 shadow-sm">
                    <Link to={`/product/${item.product.productId}`}>
                      <Card.Img 
                        variant="top" 
                        src={item.product.imageUrl || '/default-image.jpg'} 
                        alt={item.product.name || 'Product Image'} 
                        style={{ height: '200px', objectFit: 'cover' }} 
                      />
                    </Link>
                    <Card.Body>
                      <Link to={`/product/${item.product.productId}`} className="text-decoration-none">
                        <Card.Title className="text-dark">{item.product.name || 'Unnamed Product'}</Card.Title>
                      </Link>
                      <Card.Text className="text-primary fw-bold">₹{item.product.price || 'N/A'}</Card.Text>
                      <div className="d-flex justify-content-between mt-3">
                        <Button variant="outline-danger" size="sm" onClick={() => removeFromWishlist(item.wishlistId)}>
                          <FaTrash /> Remove
                        </Button>
                        <Button variant="primary" className="px-3" onClick={() => handleAddToCart(item.product)}>
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