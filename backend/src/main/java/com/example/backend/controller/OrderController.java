package com.example.backend.controller;

import com.example.backend.model.Order;
import com.example.backend.model.OrderDetail;
import com.example.backend.model.Product;
import com.example.backend.model.User;
import com.example.backend.repository.ProductRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.services.OrderDetailService;
import com.example.backend.services.OrderService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class OrderController {

    @Autowired
    private OrderService orderService;
    
    @Autowired
    private OrderDetailService orderDetailService;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private ProductRepository productRepository;

    // Create a new order
    @PostMapping
    public ResponseEntity<?> createOrder(@RequestBody Map<String, Object> orderRequest) {
        try {
            // Extract customer information
            String customerName = (String) orderRequest.get("customerName");
            String email = (String) orderRequest.get("email");
            String phone = (String) orderRequest.get("phone");
            
            // Find or create a user for this order
            User user = userRepository.findByEmail(email)
                    .orElseGet(() -> {
                        // Create a new user if not found
                        User newUser = new User();
                        newUser.setUsername(customerName);
                        newUser.setEmail(email);
                        // Set a temporary password or use a special flag for guest users
                        newUser.setPassword("guest-" + System.currentTimeMillis());
                        return userRepository.save(newUser);
                    });
            
            // Extract cart items
            List<Map<String, Object>> cartItems = (List<Map<String, Object>>) orderRequest.get("cartItems");
            
            // Calculate total amount
            BigDecimal totalAmount = BigDecimal.ZERO;
            for (Map<String, Object> item : cartItems) {
                BigDecimal price = new BigDecimal(item.get("price").toString());
                int quantity = Integer.parseInt(item.get("quantity").toString());
                totalAmount = totalAmount.add(price.multiply(new BigDecimal(quantity)));
            }
            
            // Create the order
            Order order = new Order();
            order.setUser(user);
            order.setTotalAmount(totalAmount);
            order.setStatus(Order.Status.PENDING);
            
            Order savedOrder = orderService.createOrder(order);
            
            // Create order details for each cart item
            List<OrderDetail> orderDetails = new ArrayList<>();
            for (Map<String, Object> item : cartItems) {
                Long productId = Long.parseLong(item.get("id").toString());
                int quantity = Integer.parseInt(item.get("quantity").toString());
                BigDecimal price = new BigDecimal(item.get("price").toString());
                
                Optional<Product> productOpt = productRepository.findById(productId);
                if (productOpt.isPresent()) {
                    OrderDetail detail = new OrderDetail();
                    detail.setOrder(savedOrder);
                    detail.setProduct(productOpt.get());
                    detail.setQuantity(quantity);
                    detail.setPrice(price);
                    orderDetails.add(orderDetailService.createOrderDetail(detail));
                }
            }
            
            return ResponseEntity.ok(savedOrder);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error creating order: " + e.getMessage());
        }
    }

    // Get all orders
    @GetMapping
    public ResponseEntity<List<Order>> getAllOrders() {
        List<Order> orders = orderService.getAllOrders();
        return ResponseEntity.ok(orders);
    }

    // Get order by ID
    @GetMapping("/{orderId}")
    public ResponseEntity<Order> getOrderById(@PathVariable Long orderId) {
        return orderService.getOrderById(orderId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Update order status
    @PutMapping("/{orderId}/status")
    public ResponseEntity<Order> updateOrderStatus(@PathVariable Long orderId, @RequestParam Order.Status status) {
        Order updatedOrder = orderService.updateOrderStatus(orderId, status);
        return ResponseEntity.ok(updatedOrder);
    }

    // Delete order
    @DeleteMapping("/{orderId}")
    public ResponseEntity<Void> deleteOrder(@PathVariable Long orderId) {
        orderService.deleteOrder(orderId);
        return ResponseEntity.noContent().build();
    }

    // Get orders by user ID
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Order>> getOrdersByUserId(@PathVariable Long userId) {
        List<Order> orders = orderService.getOrdersByUserId(userId);
        return ResponseEntity.ok(orders);
    }

    // Get orders by status
    @GetMapping("/status/{status}")
    public ResponseEntity<List<Order>> getOrdersByStatus(@PathVariable Order.Status status) {
        List<Order> orders = orderService.getOrdersByStatus(status);
        return ResponseEntity.ok(orders);
    }
}