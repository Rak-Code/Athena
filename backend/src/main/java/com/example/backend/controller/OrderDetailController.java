package com.example.backend.controller;

import com.example.backend.model.OrderDetail;
import com.example.backend.services.OrderDetailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/order-details")
@CrossOrigin(origins = "http://localhost:5173")
public class OrderDetailController {

    @Autowired
    private OrderDetailService orderDetailService;

    // Add order details
    @PostMapping
    public ResponseEntity<OrderDetail> addOrderDetail(@RequestBody OrderDetail orderDetail) {
        OrderDetail addedOrderDetail = orderDetailService.addOrderDetail(orderDetail);
        return ResponseEntity.ok(addedOrderDetail);
    }

    // Get order details by order ID
    @GetMapping("/order/{orderId}")
    public ResponseEntity<List<OrderDetail>> getOrderDetailsByOrderId(@PathVariable Long orderId) {
        List<OrderDetail> orderDetails = orderDetailService.getOrderDetailsByOrderId(orderId);
        return ResponseEntity.ok(orderDetails);
    }
}