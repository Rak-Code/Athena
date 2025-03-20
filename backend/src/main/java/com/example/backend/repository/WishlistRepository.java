package com.example.backend.repository;

import com.example.backend.model.Wishlist;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface WishlistRepository extends JpaRepository<Wishlist, Long> {
    List<Wishlist> findByUser_UserId(Long userId); // Find wishlist items by user ID
    Optional<Wishlist> findByUser_UserIdAndProduct_ProductId(Long userId, Long productId); // Find wishlist item by user ID and product ID
    List<Wishlist> findByProduct_ProductId(Long productId); // Find wishlist items by product ID
}