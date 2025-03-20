package com.example.backend.services;

import com.example.backend.model.ShoppingCart;
import com.example.backend.repository.ShoppingCartRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ShoppingCartService {

    @Autowired
    private ShoppingCartRepository shoppingCartRepository;

    // Add item to cart
    public ShoppingCart addToCart(ShoppingCart cartItem) {
        return shoppingCartRepository.save(cartItem);
    }

    // Get all cart items for a user
    public List<ShoppingCart> getCartItemsByUserId(Long userId) {
        return shoppingCartRepository.findByUser_UserId(userId);
    }

    // Update cart item quantity
    public ShoppingCart updateCartItemQuantity(Long cartId, int quantity) {
        ShoppingCart cartItem = shoppingCartRepository.findById(cartId)
                .orElseThrow(() -> new RuntimeException("Cart item not found with id: " + cartId));
        cartItem.setQuantity(quantity);
        return shoppingCartRepository.save(cartItem);
    }

    // Remove item from cart
    public void removeFromCart(Long cartId) {
        shoppingCartRepository.deleteById(cartId);
    }

    // Find cart item by user ID and product ID
    public Optional<ShoppingCart> findByUserIdAndProductId(Long userId, Long productId) {
        return shoppingCartRepository.findByUser_UserIdAndProduct_ProductId(userId, productId);
    }
}