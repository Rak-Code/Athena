
import React, { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import ProductCard from "./ProductCard";

const RecommendedProducts = ({ currentProductId }) => {
  const [recommended, setRecommended] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("[RecommendedProducts] currentProductId:", currentProductId);
    setLoading(true);
    fetch(`http://localhost:8080/api/products`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch recommended products: " + res.status);
        }
        return res.json();
      })
      .then((data) => {
        console.log("[RecommendedProducts] fetched data:", data);
        // Exclude the current product from recommendations and take first 4
        const filtered = data.filter(
          (prod) => prod.id !== currentProductId && prod.productId !== currentProductId
        ).slice(0, 4);
        setRecommended(filtered);
        setLoading(false);
      })
      .catch((err) => {
        console.error("[RecommendedProducts] fetch error:", err);
        setLoading(false);
      });
  }, [currentProductId]);

  if (loading) return <div className="text-center py-3">Loading recommendations...</div>;
  if (!recommended.length) return null;

  return (
    <Container className="mb-5">
      <h2 className="text-center mb-4 fw-bold">Recommended Products</h2>
      <Row xs={2} md={4} className="g-4">
        {recommended.map((product, index) => (
          <Col key={product.productId || product.id || index}>
            <ProductCard product={product} />
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default RecommendedProducts;
