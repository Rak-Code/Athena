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

    // Add item to wishlist (with check for duplicates)
    public Wishlist addToWishlist(Wishlist wishlistItem) {
        Optional<Wishlist> existingItem = wishlistRepository.findByUser_UserIdAndProduct_ProductId(
                wishlistItem.getUser().getUserId(), wishlistItem.getProduct().getProductId()
        );
        if (existingItem.isPresent()) {
            throw new RuntimeException("Product is already in the wishlist!");
        }
        return wishlistRepository.save(wishlistItem);
    }

    // Get all wishlist items for a user
    public List<Wishlist> getWishlistItemsByUserId(Long userId) {
        return wishlistRepository.findByUser_UserId(userId);
    }

    // Remove item from wishlist (with validation)
    public void removeFromWishlist(Long wishlistId) {
        if (!wishlistRepository.existsById(wishlistId)) {
            throw new RuntimeException("Wishlist item not found!");
        }
        wishlistRepository.deleteById(wishlistId);
    }

    // Find wishlist item by user ID and product ID
    public Optional<Wishlist> findByUserIdAndProductId(Long userId, Long productId) {
        return wishlistRepository.findByUser_UserIdAndProduct_ProductId(userId, productId);
    }

    // Remove all wishlist items by product ID (validate before deleting)
    public void removeByProductId(Long productId) {
        List<Wishlist> wishlistItems = wishlistRepository.findByProduct_ProductId(productId);
        if (!wishlistItems.isEmpty()) {
            wishlistRepository.deleteAll(wishlistItems);
        }
    }

    // Find wishlist item by wishlistId
    public Optional<Wishlist> findById(Long wishlistId) {
        return wishlistRepository.findById(wishlistId);
    }

}
