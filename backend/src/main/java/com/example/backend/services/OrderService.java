package com.example.backend.services;

import com.example.backend.model.Order;
import com.example.backend.model.Payment;
import com.example.backend.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private PaymentService paymentService;

    // Create a new order
    @Transactional
    public Order createOrder(Order order) {
        Order savedOrder = orderRepository.save(order);
        
        // Create a payment record for the order
        Payment payment = new Payment();
        payment.setOrder(savedOrder);
        payment.setPaymentMethod(savedOrder.getPaymentMethod());
        payment.setAmount(savedOrder.getTotalAmount());
        payment.setStatus(Payment.Status.PENDING);
        payment.setEmail(savedOrder.getEmail());
        payment.setTransactionId("TXN" + System.currentTimeMillis()); // Generate a transaction ID
        
        // Save the payment record
        paymentService.createPayment(payment);
        
        return savedOrder;
    }

    // Get all orders
    public List<Order> getAllOrders() {
        try {
            // Use the custom query to get all orders sorted by ID
            List<Order> orders = orderRepository.findAllOrderByOrderIdAsc();
            System.out.println("OrderService: Retrieved " + orders.size() + " orders from database");
            return orders;
        } catch (Exception e) {
            System.err.println("Error in OrderService.getAllOrders: " + e.getMessage());
            e.printStackTrace();
            // Re-throw the exception to be handled by the controller
            throw e;
        }
    }

    // Get order by ID
    public Optional<Order> getOrderById(Long orderId) {
        return orderRepository.findByIdWithUser(orderId);
    }

    // Update order status
    public Order updateOrderStatus(Long orderId, Order.Status status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + orderId));
        
        System.out.println("Updating order " + orderId + " status from " + order.getStatus() + " to " + status);
        
        // Validate status transition
        if (!isValidStatusTransition(order.getStatus(), status)) {
            throw new IllegalStateException(
                "Invalid status transition from " + order.getStatus() + " to " + status
            );
        }
        
        // Set the new status
        order.setStatus(status);
        
        // If customer information is missing, try to populate it from the user
        if ((order.getCustomerName() == null || order.getEmail() == null) && order.getUser() != null) {
            System.out.println("Populating missing customer information from user data");
            
            // Set customer name if missing
            if (order.getCustomerName() == null && order.getUser().getUsername() != null) {
                order.setCustomerName(order.getUser().getUsername());
            }
            
            // Set email if missing
            if (order.getEmail() == null && order.getUser().getEmail() != null) {
                order.setEmail(order.getUser().getEmail());
            }
        }
        
        Order updatedOrder = orderRepository.save(order);
        
        System.out.println("Order status updated successfully. New status: " + updatedOrder.getStatus());
        
        return updatedOrder;
    }

    // Helper method to validate status transitions
    private boolean isValidStatusTransition(Order.Status currentStatus, Order.Status newStatus) {
        if (currentStatus == null) return true;
        
        // Allow "updating" to the same status (no actual change)
        if (currentStatus == newStatus) return true;
        
        switch (currentStatus) {
            case PENDING:
                // From PENDING, can only move to PROCESSING or CANCELLED
                return newStatus == Order.Status.PROCESSING || newStatus == Order.Status.CANCELLED;
            case PROCESSING:
                // From PROCESSING, can only move to SHIPPED or CANCELLED
                return newStatus == Order.Status.SHIPPED || newStatus == Order.Status.CANCELLED;
            case SHIPPED:
                // From SHIPPED, can only move to DELIVERED
                return newStatus == Order.Status.DELIVERED;
            case DELIVERED:
                // Once DELIVERED, cannot change status
                return false;
            case CANCELLED:
                // Once CANCELLED, cannot change status
                return false;
            default:
                return false;
        }
    }

    // Delete order
    public void deleteOrder(Long orderId) {
        orderRepository.deleteById(orderId);
    }

    // Get orders by user ID
    public List<Order> getOrdersByUserId(Long userId) {
        return orderRepository.findByUser_UserId(userId);
    }

    // Get orders by status
    public List<Order> getOrdersByStatus(Order.Status status) {
        return orderRepository.findByStatus(status);
    }
}