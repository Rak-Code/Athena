import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, Badge, Form } from 'react-bootstrap';
import { FaStar, FaTrash } from 'react-icons/fa';
import '../../styles/admin/Reviews.css';

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:8080/api/reviews', {
        withCredentials: true,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.data) {
        throw new Error('No data received from server');
      }
      
      setReviews(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching reviews:', err);
      setError(err.response?.data?.message || 'Failed to load reviews. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      try {
        await axios.delete(`http://localhost:8080/api/reviews/${reviewId}`, {
          withCredentials: true,
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        });
        setReviews(reviews.filter(review => review.reviewId !== reviewId));
        // Show success message
        alert('Review deleted successfully');
      } catch (err) {
        console.error('Error deleting review:', err);
        alert(err.response?.data?.message || 'Failed to delete review. Please try again.');
      }
    }
  };

  const filteredReviews = reviews.filter(review => {
    const matchesSearch = 
      review.product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.comment.toLowerCase().includes(searchTerm.toLowerCase());

    if (filter === 'ALL') return matchesSearch;
    return matchesSearch && review.rating === parseInt(filter);
  });

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid Date';
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading reviews...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-message">
        <p>{error}</p>
        <Button variant="primary" onClick={fetchReviews}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="admin-reviews">
      <div className="admin-header">
        <h1>Product Reviews</h1>
        <div className="admin-actions">
          <Form.Control
            type="text"
            placeholder="Search reviews..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <Form.Select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="rating-filter"
          >
            <option value="ALL">All Ratings</option>
            <option value="5">5 Stars</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
            <option value="2">2 Stars</option>
            <option value="1">1 Star</option>
          </Form.Select>
          <Button variant="primary" onClick={fetchReviews}>
            Refresh
          </Button>
        </div>
      </div>

      {filteredReviews.length === 0 ? (
        <div className="no-reviews">
          <p>No reviews found</p>
          {(searchTerm || filter !== 'ALL') && (
            <Button variant="link" onClick={() => {
              setSearchTerm('');
              setFilter('ALL');
            }}>
              Clear filters
            </Button>
          )}
        </div>
      ) : (
        <div className="reviews-table-container">
          <Table responsive>
            <thead>
              <tr>
                <th>Product</th>
                <th>User</th>
                <th>Rating</th>
                <th>Comment</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredReviews.map((review) => (
                <tr key={review.reviewId}>
                  <td>
                    <div className="product-info">
                      <img
                        src={review.product.imageUrl}
                        alt={review.product.name}
                        className="product-thumbnail"
                      />
                      <span>{review.product.name}</span>
                    </div>
                  </td>
                  <td>{review.user.username}</td>
                  <td>
                    <div className="rating-stars">
                      {[...Array(5)].map((_, index) => (
                        <FaStar
                          key={index}
                          className={index < review.rating ? 'star-filled' : 'star-empty'}
                        />
                      ))}
                    </div>
                  </td>
                  <td>
                    <div className="review-comment">
                      {review.comment}
                    </div>
                  </td>
                  <td>
                    {formatDate(review.createdAt)}
                  </td>
                  <td>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDeleteReview(review.reviewId)}
                    >
                      <FaTrash />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default Reviews; 