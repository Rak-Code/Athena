package com.example.backend.controller;

import com.example.backend.model.Wishlist;
import com.example.backend.services.WishlistService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/wishlist")
@CrossOrigin(origins = "http://localhost:5173")
public class WishlistController {

    private static final Logger logger = LoggerFactory.getLogger(WishlistController.class);
    @Autowired
    private WishlistService wishlistService;

    public WishlistController(WishlistService wishlistService) {
        this.wishlistService = wishlistService;
    }

    @PostMapping
    public ResponseEntity<?> addToWishlist(@RequestBody Wishlist wishlistItem) {
        logger.info("Adding to wishlist: {}", wishlistItem);

        if (wishlistItem.getUser() == null || wishlistItem.getUser().getUserId() == null) {
            logger.warn("User information is missing or invalid");
            return ResponseEntity.badRequest().body(Map.of("message", "User information is missing or invalid"));
        }

        if (wishlistItem.getProduct() == null || wishlistItem.getProduct().getProductId() == null) {
            logger.warn("Product information is missing or invalid");
            return ResponseEntity.badRequest().body(Map.of("message", "Product information is missing or invalid"));
        }

        Optional<Wishlist> existingItem = wishlistService.findByUserIdAndProductId(
                wishlistItem.getUser().getUserId(), wishlistItem.getProduct().getProductId()
        );

        if (existingItem.isPresent()) {
            logger.warn("Product is already in the wishlist");
            return ResponseEntity.status(409).body(Map.of("message", "Product is already in the wishlist!"));
        }

        Wishlist addedItem = wishlistService.addToWishlist(wishlistItem);
        logger.info("Added to wishlist: {}", addedItem);
        return ResponseEntity.ok(addedItem);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getWishlistItemsByUserId(@PathVariable Long userId) {
        logger.info("Getting wishlist items for user: {}", userId);

        List<Wishlist> wishlistItems = wishlistService.getWishlistItemsByUserId(userId);

        if (wishlistItems.isEmpty()) {
            logger.warn("No wishlist items found for user: {}", userId);
            return ResponseEntity.ok(Map.of("message", "No wishlist items found"));
        }

        logger.info("Found {} wishlist items", wishlistItems.size());
        return ResponseEntity.ok(wishlistItems);
    }

    @DeleteMapping("/{wishlistId}")
    public ResponseEntity<?> removeFromWishlist(@PathVariable Long wishlistId) {
        logger.info("Removing wishlist item: {}", wishlistId);

        try {
            wishlistService.removeFromWishlist(wishlistId);
            logger.info("Wishlist item removed successfully");
            return ResponseEntity.ok(Map.of("message", "Wishlist item removed successfully"));
        } catch (RuntimeException e) {
            logger.error("Error removing wishlist item: {}", e.getMessage());
            return ResponseEntity.status(404).body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            logger.error("Unexpected error removing wishlist item: {}", e.getMessage(), e);
            return ResponseEntity.status(500).body(Map.of("message", "Unexpected error: " + e.getMessage()));
        }
    }

    @DeleteMapping("/user/{userId}/product/{productId}")
    public ResponseEntity<?> removeByUserAndProduct(@PathVariable Long userId, @PathVariable Long productId) {
        logger.info("Removing wishlist item for user: {}, product: {}", userId, productId);

        Optional<Wishlist> wishlistItem = wishlistService.findByUserIdAndProductId(userId, productId);

        if (wishlistItem.isEmpty()) {
            logger.warn("Wishlist item not found for user: {}, product: {}", userId, productId);
            return ResponseEntity.status(404).body(Map.of("message", "Wishlist item not found!"));
        }

        wishlistService.removeFromWishlist(wishlistItem.get().getWishlistId());
        logger.info("Wishlist item removed successfully");
        return ResponseEntity.ok(Map.of("message", "Wishlist item removed successfully"));
    }
}