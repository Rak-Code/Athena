import React, { useEffect, useState } from "react";

const ReviewsSection = ({ productId }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:8080/api/reviews/product/${productId}`)
      .then((response) => response.json())
      .then((data) => {
        setReviews(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching reviews:", error);
        setLoading(false);
      });
  }, [productId]);

  if (loading) return <p className="text-center text-gray-500">Loading reviews...</p>;

  return (
    <div className="mt-10">
      <h2 className="text-2xl font-bold mb-4">Customer Reviews</h2>
      {reviews.length > 0 ? (
    reviews.map((review) => (
        <div key={review.reviewId} className="review"> 
            <h4>{review.user.username}</h4>
            <p>Rating: {review.rating} ⭐</p>
            <p>{review.comment}</p>
        </div>
    ))
) : (
    <p>No reviews yet.</p>
)}

    </div>
  );
};

export default ReviewsSection;
