import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../../styles/admin/ProductForm.css";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stockQuantity: "",
    imageUrl: "",
    categoryId: "",
    size: "MEDIUM",
    color: "",
    brand: "",
    featured: false
  });

  useEffect(() => {
    fetchProductAndCategories();
  }, [id]);

  const fetchProductAndCategories = async () => {
    try {
      setLoading(true);
      
      // Fetch product details
      const productResponse = await axios.get(`http://localhost:8080/api/products/${id}`, {
        withCredentials: true
      });
      
      // Fetch categories
      const categoriesResponse = await axios.get("http://localhost:8080/api/categories", {
        withCredentials: true
      });
      
      const product = productResponse.data;
      
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price,
        stockQuantity: product.stockQuantity,
        imageUrl: product.imageUrl,
        categoryId: product.category?.categoryId || "",
        size: product.size || "MEDIUM",
        color: product.color || "",
        brand: product.brand || "",
        featured: product.featured || false
      });
      
      setCategories(categoriesResponse.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to load product data");
      setLoading(false);
      console.error("Error fetching product data:", err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);
      
      // Convert string values to appropriate types
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        stockQuantity: parseInt(formData.stockQuantity),
        categoryId: parseInt(formData.categoryId)
      };
      
      await axios.put(`http://localhost:8080/api/products/${id}`, productData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      setLoading(false);
      navigate("/admin/products");
    } catch (err) {
      setLoading(false);
      console.error("Error updating product:", err);
      setError("Failed to update product. Please try again.");
    }
  };

  if (loading) return <div className="loading">Loading product data...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="product-form-container">
      <div className="form-header">
        <h1>Edit Product</h1>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit} className="product-form">
        <div className="form-group">
          <label htmlFor="name">Product Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            required
          />
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="price">Price (₹)</label>
            <input
              type="number"
              id="price"
              name="price"
              min="0"
              step="0.01"
              value={formData.price}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="stockQuantity">Stock Quantity</label>
            <input
              type="number"
              id="stockQuantity"
              name="stockQuantity"
              min="0"
              value={formData.stockQuantity}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="imageUrl">Image URL</label>
          <input
            type="url"
            id="imageUrl"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleInputChange}
            required
          />
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="categoryId">Category</label>
            <select
              id="categoryId"
              name="categoryId"
              value={formData.categoryId}
              onChange={handleInputChange}
              required
            >
              <option value="">Select Category</option>
              {categories.map(category => (
                <option key={category.categoryId} value={category.categoryId}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="size">Size</label>
            <select
              id="size"
              name="size"
              value={formData.size}
              onChange={handleInputChange}
            >
              <option value="SMALL">Small</option>
              <option value="MEDIUM">Medium</option>
              <option value="LARGE">Large</option>
              <option value="XLARGE">X-Large</option>
            </select>
          </div>
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="color">Color</label>
            <input
              type="text"
              id="color"
              name="color"
              value={formData.color}
              onChange={handleInputChange}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="brand">Brand</label>
            <input
              type="text"
              id="brand"
              name="brand"
              value={formData.brand}
              onChange={handleInputChange}
            />
          </div>
        </div>
        
        <div className="form-group checkbox-group">
          <input
            type="checkbox"
            id="featured"
            name="featured"
            checked={formData.featured}
            onChange={handleInputChange}
          />
          <label htmlFor="featured">Featured Product</label>
        </div>
        
        <div className="form-actions">
          <button 
            type="button" 
            onClick={() => navigate("/admin/products")}
            className="btn btn-secondary"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? "Updating..." : "Update Product"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProduct;