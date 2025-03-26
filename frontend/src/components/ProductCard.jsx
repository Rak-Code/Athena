import React from "react"; 
import { Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();

  console.log("Product Data:", product); // Debugging line

  return (
    <Card
      className="h-100 border shadow-sm"
      onClick={() => {
        if (!product || !product.productId) {
          console.error("Product ID is undefined:", product);
          return;
        }
        navigate(`/product/${product.productId}`);
      }}
      style={{
        transition: "transform 0.3s ease-in-out",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
    >
      <Card.Img
        variant="top"
        src={product?.imageUrl || "placeholder.jpg"} // Default placeholder
        alt={product?.name || "Product Image"}
        style={{ height: "220px", objectFit: "cover" }}
      />
      <Card.Body className="text-center py-3">
        <Card.Title className="fs-6 mb-2">{product?.name || "Unknown"}</Card.Title>
        <Card.Text className="text-muted">₹{product?.price || "N/A"}</Card.Text>
      </Card.Body>
    </Card>
  );
};

export default ProductCard;
