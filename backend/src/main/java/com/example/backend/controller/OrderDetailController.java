package com.example.backend.controller;

import com.example.backend.model.OrderDetail;
import com.example.backend.services.OrderDetailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/order-details")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
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
        try {
            System.out.println("Fetching order details for orderId: " + orderId);
            List<OrderDetail> orderDetails = orderDetailService.getOrderDetailsByOrderId(orderId);
            System.out.println("Found " + orderDetails.size() + " order details");
            if (!orderDetails.isEmpty()) {
                OrderDetail firstDetail = orderDetails.get(0);
                System.out.println("Sample order detail - Product: " + 
                    (firstDetail.getProduct() != null ? firstDetail.getProduct().getName() : "null") +
                    ", Quantity: " + firstDetail.getQuantity() +
                    ", Price: " + firstDetail.getPrice());
            }
            return ResponseEntity.ok(orderDetails);
        } catch (Exception e) {
            System.err.println("Error fetching order details: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500)
                .body(List.of()); // Return empty list on error
        }
    }
}