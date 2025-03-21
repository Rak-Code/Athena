package com.example.backend.controller;

import com.example.backend.model.ShoppingCart;
import com.example.backend.services.ShoppingCartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin(origins = "http://localhost:5173")
public class ShoppingCartController {

    @Autowired
    private ShoppingCartService shoppingCartService;

    // Add item to cart
    @PostMapping
    public ResponseEntity<ShoppingCart> addToCart(@RequestBody ShoppingCart cartItem) {
        ShoppingCart addedItem = shoppingCartService.addToCart(cartItem);
        return ResponseEntity.ok(addedItem);
    }

    // Get all cart items for a user
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<ShoppingCart>> getCartItemsByUserId(@PathVariable Long userId) {
        List<ShoppingCart> cartItems = shoppingCartService.getCartItemsByUserId(userId);
        return ResponseEntity.ok(cartItems);
    }

    // Update cart item quantity
    @PutMapping("/{cartId}")
    public ResponseEntity<ShoppingCart> updateCartItemQuantity(@PathVariable Long cartId, @RequestParam int quantity) {
        ShoppingCart updatedItem = shoppingCartService.updateCartItemQuantity(cartId, quantity);
        return ResponseEntity.ok(updatedItem);
    }

    // Remove item from cart
    @DeleteMapping("/{cartId}")
    public ResponseEntity<Void> removeFromCart(@PathVariable Long cartId) {
        shoppingCartService.removeFromCart(cartId);
        return ResponseEntity.noContent().build();
    }
}