package com.example.backend.repository;

import com.example.backend.model.OrderDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface OrderDetailRepository extends JpaRepository<OrderDetail, Long> {
    @EntityGraph(attributePaths = {"product"})
    @Query("SELECT od FROM OrderDetail od WHERE od.order.orderId = :orderId")
    List<OrderDetail> findByOrder_OrderId(@Param("orderId") Long orderId);
}