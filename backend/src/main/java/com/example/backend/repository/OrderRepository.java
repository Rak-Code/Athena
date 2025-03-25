package com.example.backend.repository;

import com.example.backend.model.Order;
import com.example.backend.model.Order.Status;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    // Basic queries
    @EntityGraph(attributePaths = {"user", "orderDetails", "orderDetails.product"})
    @Query("SELECT o FROM Order o ORDER BY o.orderDate DESC")
    List<Order> findAllWithUser();

    @EntityGraph(attributePaths = {"user", "orderDetails", "orderDetails.product"})
    @Query("SELECT o FROM Order o WHERE o.orderId = :id")
    Optional<Order> findByIdWithUser(@Param("id") Long id);

    // User-specific queries
    @Query("SELECT o FROM Order o LEFT JOIN FETCH o.user WHERE o.user.userId = :userId ORDER BY o.orderDate DESC")
    List<Order> findByUserIdWithUser(@Param("userId") Long userId);

    // Status-specific queries
    @Query("SELECT o FROM Order o LEFT JOIN FETCH o.user WHERE o.status = :status ORDER BY o.orderDate DESC")
    List<Order> findByStatusWithUser(@Param("status") Status status);

    // Dashboard queries
    @Query("SELECT o FROM Order o LEFT JOIN FETCH o.user ORDER BY o.orderDate DESC LIMIT :limit")
    List<Order> findRecentOrders(@Param("limit") int limit);

    // Legacy queries (keep for backward compatibility)
    @Query("SELECT o FROM Order o ORDER BY o.orderId ASC")
    List<Order> findAllOrderByOrderIdAsc();

    List<Order> findByUser_UserId(Long userId);
    List<Order> findByStatus(Status status);
}