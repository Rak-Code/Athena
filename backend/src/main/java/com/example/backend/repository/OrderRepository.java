package com.example.backend.repository;

import com.example.backend.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUser_UserId(Long userId); // Find orders by user ID
    List<Order> findByStatus(Order.Status status); // Find orders by status
    
    // Find all orders sorted by ID to ensure we get all of them
    @Query("SELECT o FROM Order o ORDER BY o.orderId")
    List<Order> findAllOrderByOrderIdAsc();
}