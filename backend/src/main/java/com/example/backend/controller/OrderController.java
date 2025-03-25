package com.example.backend.controller;

import com.example.backend.model.Order;
import com.example.backend.model.OrderDetail;
import com.example.backend.model.Product;
import com.example.backend.model.User;
import com.example.backend.repository.ProductRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.services.OrderDetailService;
import com.example.backend.services.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.*;

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
    public ResponseEntity<Map<String, Object>> createOrder(@RequestBody Map<String, Object> orderRequest) {
        try {
            System.out.println("Received order request: " + orderRequest);
            
            // Extract customer information
            String customerName = (String) orderRequest.get("customerName");
            String email = (String) orderRequest.get("email");
            String phone = (String) orderRequest.get("phone");
            Long userId = orderRequest.get("userId") != null ? Long.parseLong(orderRequest.get("userId").toString()) : null;

            System.out.println("Processing order for user ID: " + userId);

            // Find user by ID first, then by email if ID not found
            User user;
            if (userId != null) {
                user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));
                System.out.println("Found user: " + user.getUsername());
            } else {
                user = userRepository.findByEmail(email).orElseGet(() -> {
                    User newUser = new User();
                    newUser.setUsername(customerName);
                    newUser.setEmail(email);
                    newUser.setPassword("guest-" + System.currentTimeMillis()); // Temporary password
                    return userRepository.save(newUser);
                });
            }

            // Extract cart items
            List<Map<String, Object>> cartItems = (List<Map<String, Object>>) orderRequest.get("cartItems");
            System.out.println("Received cart items: " + cartItems);

            if (cartItems == null || cartItems.isEmpty()) {
                throw new RuntimeException("No cart items provided");
            }

            // Calculate total amount
            BigDecimal totalAmount = BigDecimal.ZERO;
            for (Map<String, Object> item : cartItems) {
                System.out.println("Processing cart item: " + item);
                
                Object priceObj = item.get("price");
                Object quantityObj = item.get("quantity");
                Object idObj = item.get("id");
                
                if (priceObj == null || quantityObj == null || idObj == null) {
                    System.out.println("Missing required fields in cart item:");
                    System.out.println("price: " + priceObj);
                    System.out.println("quantity: " + quantityObj);
                    System.out.println("id: " + idObj);
                    throw new RuntimeException("Cart item is missing required fields");
                }

                BigDecimal price = new BigDecimal(priceObj.toString());
                int quantity = Integer.parseInt(quantityObj.toString());
                totalAmount = totalAmount.add(price.multiply(new BigDecimal(quantity)));
                System.out.println("Processing item: ID=" + idObj + ", quantity=" + quantity + ", price=" + price);
            }

            // Create the order
            Order order = new Order();
            order.setUser(user);
            order.setTotalAmount(totalAmount);
            order.setStatus(Order.Status.PENDING);
            
            // Set customer information
            order.setCustomerName(customerName);
            order.setEmail(email);
            order.setPhone(phone);
            
            // Extract shipping/billing info if available
            String shippingAddress = (String) orderRequest.get("shippingAddress");
            String billingAddress = (String) orderRequest.get("billingAddress");
            String paymentMethod = (String) orderRequest.get("paymentMethod");
            
            if (shippingAddress != null) {
                order.setShippingAddress(shippingAddress);
            }
            
            if (billingAddress != null) {
                order.setBillingAddress(billingAddress);
            }
            
            if (paymentMethod != null) {
                order.setPaymentMethod(paymentMethod);
            }

            Order savedOrder = orderService.createOrder(order);
            System.out.println("Created order with ID: " + savedOrder.getOrderId());

            // Create order details for each cart item
            List<Map<String, Object>> orderDetailsList = new ArrayList<>();
            System.out.println("Processing " + cartItems.size() + " cart items");
            
            for (Map<String, Object> item : cartItems) {
                Long productId = Long.parseLong(item.get("id").toString());
                int quantity = Integer.parseInt(item.get("quantity").toString());
                BigDecimal price = new BigDecimal(item.get("price").toString());

                System.out.println("Creating order detail for product ID: " + productId);
                Optional<Product> productOpt = productRepository.findById(productId);
                if (productOpt.isPresent()) {
                    OrderDetail detail = new OrderDetail();
                    detail.setOrder(savedOrder);
                    detail.setProduct(productOpt.get());
                    detail.setQuantity(quantity);
                    detail.setPrice(price);
                    OrderDetail savedDetail = orderDetailService.createOrderDetail(detail);
                    System.out.println("Created order detail with ID: " + savedDetail.getOrderDetailId());

                    // Adding order details to response
                    Map<String, Object> orderDetailResponse = new HashMap<>();
                    orderDetailResponse.put("orderDetailId", savedDetail.getOrderDetailId());
                    orderDetailResponse.put("productId", productOpt.get().getProductId());
                    orderDetailResponse.put("name", productOpt.get().getName());
                    orderDetailResponse.put("quantity", quantity);
                    orderDetailResponse.put("price", price);
                    orderDetailsList.add(orderDetailResponse);
                } else {
                    System.out.println("Product not found with ID: " + productId);
                    throw new RuntimeException("Product not found with ID: " + productId);
                }
            }

            // Create a response map with only necessary details
            Map<String, Object> response = new HashMap<>();
            response.put("orderId", savedOrder.getOrderId());
            response.put("status", savedOrder.getStatus());
            response.put("totalAmount", savedOrder.getTotalAmount());
            response.put("orderDate", savedOrder.getOrderDate());
            response.put("orderItems", orderDetailsList);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();

            // FIXED: Changed errorResponse type to Map<String, Object> instead of Map<String, String>
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Error creating order: " + e.getMessage());
            return ResponseEntity.status(500).body(errorResponse);
        }
    }

    // Get all orders
    @GetMapping
    public ResponseEntity<?> getAllOrders() {
        try {
            List<Order> orders = orderService.getAllOrders();
            System.out.println("Fetched " + orders.size() + " orders from database");
            
            // Log the first few order IDs for debugging
            if (!orders.isEmpty()) {
                System.out.println("Sample order IDs: " + 
                    orders.stream()
                        .limit(10)
                        .map(order -> order.getOrderId().toString())
                        .reduce((a, b) -> a + ", " + b)
                        .orElse("none"));
            }
            
            return ResponseEntity.ok(orders);
        } catch (Exception e) {
            System.err.println("Error fetching all orders: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500)
                .body(Map.of("error", "Failed to fetch orders: " + e.getMessage()));
        }
    }

    // Get order by ID
    @GetMapping("/{orderId}")
    public ResponseEntity<Order> getOrderById(@PathVariable Long orderId) {
        System.out.println("Fetching order with ID: " + orderId);
        Optional<Order> orderOpt = orderService.getOrderById(orderId);
        if (orderOpt.isPresent()) {
            Order order = orderOpt.get();
            System.out.println("Found order - Status: " + order.getStatus() + 
                             ", Total Amount: " + order.getTotalAmount() +
                             ", Customer: " + order.getCustomerName());
            if (order.getOrderDetails() != null) {
                System.out.println("Order has " + order.getOrderDetails().size() + " items");
            } else {
                System.out.println("Order details list is null");
            }
        } else {
            System.out.println("Order not found with ID: " + orderId);
        }
        return orderService.getOrderById(orderId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Update order status
    @PutMapping("/{orderId}/status")
    public ResponseEntity<?> updateOrderStatus(@PathVariable Long orderId, @RequestParam Order.Status status) {
        try {
            System.out.println("Received status update request - OrderId: " + orderId + ", New Status: " + status);
            
            // First check if order exists
            Optional<Order> orderOpt = orderService.getOrderById(orderId);
            if (!orderOpt.isPresent()) {
                System.err.println("Order not found with ID: " + orderId);
                return ResponseEntity.status(404)
                    .body(Map.of("error", "Order not found with ID: " + orderId));
            }
            
            // Try to update the status
            try {
                Order updatedOrder = orderService.updateOrderStatus(orderId, status);
                System.out.println("Successfully updated order status - OrderId: " + orderId + 
                                 ", Old Status: " + orderOpt.get().getStatus() + 
                                 ", New Status: " + updatedOrder.getStatus());
                return ResponseEntity.ok(updatedOrder);
            } catch (IllegalStateException e) {
                // Handle invalid status transition
                System.err.println("Invalid status transition: " + e.getMessage());
                return ResponseEntity.status(400)
                    .body(Map.of("error", e.getMessage()));
            }
        } catch (Exception e) {
            System.err.println("Error updating order status: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500)
                .body(Map.of("error", "Failed to update order status: " + e.getMessage()));
        }
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
