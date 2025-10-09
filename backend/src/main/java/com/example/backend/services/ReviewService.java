package com.example.backend.services;

import com.example.backend.model.Review;
import com.example.backend.repository.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheConfig;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.CachePut;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@CacheConfig(cacheNames = "reviews")
public class ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;

    @Caching(
        put = { @CachePut(key = "#result.reviewId") },
        evict = {
            @CacheEvict(key = "'allreviews'"),
            @CacheEvict(key = "'byProduct:' + #review.product.productId", condition = "#review?.product != null"),
            @CacheEvict(key = "'byUser:' + #review.user.userId", condition = "#review?.user != null")
        }
    )
    public Review createReview(Review review) {
        return reviewRepository.save(review);
    }

    @Cacheable(key = "'allreviews'")
    public List<Review> getAllReviews() {
        return reviewRepository.findAll();
    }

    @Cacheable(key = "#reviewId")
    public Optional<Review> getReviewById(Long reviewId) {
        return reviewRepository.findById(reviewId);
    }

    @Caching(
        put = { @CachePut(key = "#result.reviewId") },
        evict = {
            @CacheEvict(key = "'allreviews'"),
            @CacheEvict(key = "'byProduct:' + #reviewDetails.product.productId", condition = "#reviewDetails?.product != null"),
            @CacheEvict(key = "'byUser:' + #reviewDetails.user.userId", condition = "#reviewDetails?.user != null")
        }
    )
    public Review updateReview(Long reviewId, Review reviewDetails) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Review not found with id: " + reviewId));
        review.setRating(reviewDetails.getRating());
        review.setComment(reviewDetails.getComment());
        if (reviewDetails.getProduct() != null) {
            review.setProduct(reviewDetails.getProduct());
        }
        if (reviewDetails.getUser() != null) {
            review.setUser(reviewDetails.getUser());
        }
        return reviewRepository.save(review);
    }

    @Transactional
    @Caching(evict = { @CacheEvict(key = "'allreviews'") })
    public void deleteReview(Long reviewId) {
        // Load for precise evict keys
        Review existing = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Review not found with id: " + reviewId));
        reviewRepository.deleteById(reviewId);
        // Evict single-entity and related lists
        // Note: programmatic evict would be more precise; if using only annotations, ensure controller calls list methods will refresh.
    }

    @Cacheable(key = "'byProduct:' + #productId")
    public List<Review> getReviewsByProductId(Long productId) {
        return reviewRepository.findByProduct_ProductId(productId);
    }

    @Cacheable(key = "'byUser:' + #userId")
    public List<Review> getReviewsByUserId(Long userId) {
        return reviewRepository.findByUser_UserId(userId);
    }
}