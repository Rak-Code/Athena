package com.example.backend.services;

import com.example.backend.model.Wishlist;
import com.example.backend.repository.WishlistRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class WishlistService {

    @Autowired
    private WishlistRepository wishlistRepository;

    // Add item to wishlist
    public Wishlist addToWishlist(Wishlist wishlistItem) {
        return wishlistRepository.save(wishlistItem);
    }

    // Get all wishlist items for a user
    public List<Wishlist> getWishlistItemsByUserId(Long userId) {
        return wishlistRepository.findByUser_UserId(userId);
    }

    // Remove item from wishlist
    public void removeFromWishlist(Long wishlistId) {
        wishlistRepository.deleteById(wishlistId);
    }

    // Find wishlist item by user ID and product ID
    public Optional<Wishlist> findByUserIdAndProductId(Long userId, Long productId) {
        return wishlistRepository.findByUser_UserIdAndProduct_ProductId(userId, productId);
    }

    // Remove all wishlist items by product ID
    public void removeByProductId(Long productId) {
        List<Wishlist> wishlistItems = wishlistRepository.findByProduct_ProductId(productId);
        if (!wishlistItems.isEmpty()) {
            wishlistRepository.deleteAll(wishlistItems);
        }
    }
}