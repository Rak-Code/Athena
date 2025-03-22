import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Row, Col } from "react-bootstrap";
import ProductCard from "./ProductCard";

const ProductList = ({ searchTerm, categoryId }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [prevProducts, setPrevProducts] = useState([]);
  const [fadeIn, setFadeIn] = useState(true);

  useEffect(() => {
    // Don't immediately set loading to true - this causes the flicker
    // Instead, fade out current products first
    setFadeIn(false);
    
    // Short timeout to allow fade out animation
    const timer = setTimeout(() => {
      setLoading(true);
      
      let url;
      
      if (searchTerm) {
        url = `http://localhost:8080/api/products/search/${searchTerm}`;
      } else if (categoryId) {
        url = `http://localhost:8080/api/products/category/${categoryId}`;
      } else {
        url = "http://localhost:8080/api/products";
      }
  
      axios
        .get(url)
        .then((response) => {
          // Save current products before updating
          setPrevProducts(products);
          setProducts(response.data);
          setLoading(false);
          // Trigger fade in animation
          setFadeIn(true);
        })
        .catch((error) => {
          console.error("Error fetching products:", error);
          setPrevProducts(products);
          setProducts([]);
          setLoading(false);
          setFadeIn(true);
        });
    }, 200); // Short delay for fade out animation
    
    return () => clearTimeout(timer);
  }, [searchTerm, categoryId]); // Re-fetch when search term or category changes

  // Display products based on loading state
  const displayProducts = loading ? prevProducts : products;

  return (
    <Container className="py-5">
      <h2 className="text-center mb-4 fw-bold">Trendy Outfits</h2>

      <div className={`product-grid-container ${fadeIn ? 'fade-in' : 'fade-out'}`} style={{
        opacity: fadeIn ? 1 : 0.5,
        transition: 'opacity 0.3s ease-in-out'
      }}>
        {displayProducts.length > 0 ? (
          <Row xs={2} md={4} className="g-4">
            {displayProducts.map((product, index) => (
              <Col key={product.productId || index}>
                <ProductCard product={product} />
              </Col>
            ))}
          </Row>
        ) : (
          <div className="text-center py-5">
            {loading ? (
              <div className="loading-spinner">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-3">Loading products...</p>
              </div>
            ) : (
              <p>No products found.</p>
            )}
          </div>
        )}
      </div>
    </Container>
  );
};

export default ProductList;