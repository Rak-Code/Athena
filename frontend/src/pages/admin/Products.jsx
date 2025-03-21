import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../../styles/admin/Products.css";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(10);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:8080/api/products", {
        withCredentials: true
      });
      setProducts(response.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to load products");
      setLoading(false);
      console.error("Error fetching products:", err);
    }
  };

  const handleDelete = async (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await axios.delete(`http://localhost:8080/api/products/${productId}`, {
          withCredentials: true
        });
        // Refresh products list
        fetchProducts();
      } catch (err) {
        console.error("Error deleting product:", err);
        alert("Failed to delete product. Please try again.");
      }
    }
  };

  // Filter products based on search term
  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) return <div className="loading">Loading products...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="admin-products">
      <div className="admin-header">
        <h1>Manage Products</h1>
        <div className="admin-actions">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <Link to="/admin/products/add" className="btn btn-primary">Add New Product</Link>
        </div>
      </div>
      
      {currentProducts.length === 0 ? (
        <div className="no-products">
          <p>No products found</p>
          <Link to="/admin/products/add" className="btn btn-primary">Add New Product</Link>
        </div>
      ) : (
        <>
          <div className="products-table-container">
            <table className="products-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentProducts.map(product => (
                  <tr key={product.productId}>
                    <td>{product.productId}</td>
                    <td>
                      <img 
                        src={product.imageUrl} 
                        alt={product.name} 
                        className="product-thumbnail" 
                      />
                    </td>
                    <td>{product.name}</td>
                    <td>{product.category?.name || "Uncategorized"}</td>
                    <td>₹{parseFloat(product.price).toFixed(2)}</td>
                    <td>{product.stockQuantity}</td>
                    <td className="actions-cell">
                      <Link 
                        to={`/admin/products/edit/${product.productId}`} 
                        className="btn btn-sm btn-info"
                      >
                        Edit
                      </Link>
                      <button 
                        onClick={() => handleDelete(product.productId)} 
                        className="btn btn-sm btn-danger"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination">
              <button 
                onClick={() => paginate(currentPage - 1)} 
                disabled={currentPage === 1}
                className="page-btn"
              >
                Previous
              </button>
              
              {[...Array(totalPages).keys()].map(number => (
                <button
                  key={number + 1}
                  onClick={() => paginate(number + 1)}
                  className={`page-btn ${currentPage === number + 1 ? 'active' : ''}`}
                >
                  {number + 1}
                </button>
              ))}
              
              <button 
                onClick={() => paginate(currentPage + 1)} 
                disabled={currentPage === totalPages}
                className="page-btn"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Products;