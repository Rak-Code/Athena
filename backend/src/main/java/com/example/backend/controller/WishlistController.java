package com.example.backend.controller;

import com.example.backend.model.Wishlist;
import com.example.backend.services.WishlistService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/wishlist")
@CrossOrigin(origins = "http://localhost:5173")
public class WishlistController {

    @Autowired
    private WishlistService wishlistService;

    // Add item to wishlist (handle duplicates)
    @PostMapping
    public ResponseEntity<?> addToWishlist(@RequestBody Wishlist wishlistItem) {
        System.out.println("Adding to wishlist: " + wishlistItem);
        
        try {
            // Validate input
            if (wishlistItem.getUser() == null || wishlistItem.getUser().getUserId() == null) {
                System.out.println("User is null or has null ID");
                return ResponseEntity.badRequest().body("User information is missing or invalid");
            }
            
            if (wishlistItem.getProduct() == null || wishlistItem.getProduct().getProductId() == null) {
                System.out.println("Product is null or has null ID");
                return ResponseEntity.badRequest().body("Product information is missing or invalid");
            }
            
            System.out.println("User ID: " + wishlistItem.getUser().getUserId() + ", Product ID: " + wishlistItem.getProduct().getProductId());
            
            Optional<Wishlist> existingItem = wishlistService.findByUserIdAndProductId(
                    wishlistItem.getUser().getUserId(), wishlistItem.getProduct().getProductId()
            );

            if (existingItem.isPresent()) {
                System.out.println("Product already in wishlist");
                return ResponseEntity.status(409).body("Product is already in the wishlist!");
            }

            Wishlist addedItem = wishlistService.addToWishlist(wishlistItem);
            System.out.println("Added to wishlist: " + addedItem);
            return ResponseEntity.ok(addedItem);
        } catch (Exception e) {
            System.out.println("Error adding to wishlist: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error adding to wishlist: " + e.getMessage());
        }
    }

    // Get all wishlist items for a user
    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getWishlistItemsByUserId(@PathVariable Long userId) {
        System.out.println("Getting wishlist items for user: " + userId);
        
        try {
            List<Wishlist> wishlistItems = wishlistService.getWishlistItemsByUserId(userId);
            
            System.out.println("Found " + wishlistItems.size() + " wishlist items");
            wishlistItems.forEach(item -> {
                System.out.println("Wishlist item: " + item.getWishlistId() + 
                                ", Product: " + item.getProduct().getProductId() + 
                                ", Name: " + item.getProduct().getName());
            });
            
            return ResponseEntity.ok(wishlistItems);
        } catch (Exception e) {
            System.out.println("Error getting wishlist items: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error getting wishlist items: " + e.getMessage());
        }
    }

    // Remove item from wishlist (handle non-existent items)
    @DeleteMapping("/{wishlistId}")
    public ResponseEntity<?> removeFromWishlist(@PathVariable Long wishlistId) {
        System.out.println("Removing wishlist item: " + wishlistId);
        
        try {
            wishlistService.removeFromWishlist(wishlistId);
            System.out.println("Wishlist item removed successfully");
            return ResponseEntity.ok("Wishlist item removed successfully");
        } catch (RuntimeException e) {
            System.out.println("Error removing wishlist item: " + e.getMessage());
            return ResponseEntity.status(404).body(e.getMessage());
        } catch (Exception e) {
            System.out.println("Unexpected error removing wishlist item: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body("Unexpected error: " + e.getMessage());
        }
    }
    
    // Remove wishlist item by user ID and product ID
    @DeleteMapping("/user/{userId}/product/{productId}")
    public ResponseEntity<?> removeByUserAndProduct(@PathVariable Long userId, @PathVariable Long productId) {
        System.out.println("Removing wishlist item for user: " + userId + ", product: " + productId);
        
        try {
            Optional<Wishlist> wishlistItem = wishlistService.findByUserIdAndProductId(userId, productId);
            
            if (wishlistItem.isEmpty()) {
                System.out.println("Wishlist item not found");
                return ResponseEntity.status(404).body("Wishlist item not found!");
            }
            
            wishlistService.removeFromWishlist(wishlistItem.get().getWishlistId());
            System.out.println("Wishlist item removed successfully");
            return ResponseEntity.ok("Wishlist item removed successfully");
        } catch (Exception e) {
            System.out.println("Error removing wishlist item: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error removing wishlist item: " + e.getMessage());
        }
    }
}
