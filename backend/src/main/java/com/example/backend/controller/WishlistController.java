package com.example.backend.controller;

import com.example.backend.model.Wishlist;
import com.example.backend.services.WishlistService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/wishlist")
@CrossOrigin(origins = "http://localhost:5173")
public class WishlistController {

    @Autowired
    private WishlistService wishlistService;

    // Add item to wishlist
    @PostMapping
    public ResponseEntity<Wishlist> addToWishlist(@RequestBody Wishlist wishlistItem) {
        Wishlist addedItem = wishlistService.addToWishlist(wishlistItem);
        return ResponseEntity.ok(addedItem);
    }

    // Get all wishlist items for a user
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Wishlist>> getWishlistItemsByUserId(@PathVariable Long userId) {
        List<Wishlist> wishlistItems = wishlistService.getWishlistItemsByUserId(userId);
        return ResponseEntity.ok(wishlistItems);
    }

    // Remove item from wishlist
    @DeleteMapping("/{wishlistId}")
    public ResponseEntity<Void> removeFromWishlist(@PathVariable Long wishlistId) {
        wishlistService.removeFromWishlist(wishlistId);
        return ResponseEntity.noContent().build();
    }
}