import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaStar } from "react-icons/fa";
import "../styles/ReviewsSection.css";

const ReviewsSection = ({ productId }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/reviews/product/${productId}`,
          {
            withCredentials: true,
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            }
          }
        );
        setReviews(response.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching reviews:", err);
        setError("Failed to load reviews. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [productId]);

  if (loading) return (
    <div className="reviews-loading">
      <p>Loading reviews...</p>
    </div>
  );

  if (error) return (
    <div className="reviews-error">
      <p>{error}</p>
    </div>
  );

  return (
    <div className="reviews-section">
      <h2>Customer Reviews</h2>
      {reviews.length > 0 ? (
        <div className="reviews-list">
          {reviews.map((review) => (
            <div key={review.reviewId} className="review-card">
              <div className="review-header">
                <span className="reviewer-name">{review.user.username}</span>
                <div className="rating">
                  {[...Array(5)].map((_, index) => (
                    <FaStar
                      key={index}
                      className={index < review.rating ? "star-filled" : "star-empty"}
                    />
                  ))}
                </div>
              </div>
              <p className="review-date">
                {new Date(review.createdAt).toLocaleDateString()}
              </p>
              <p className="review-comment">{review.comment}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-reviews">
          <p>No reviews yet. Be the first to review this product!</p>
        </div>
      )}
    </div>
  );
};

export default ReviewsSection;
