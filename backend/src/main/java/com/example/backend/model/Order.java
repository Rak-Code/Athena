package com.example.backend.model;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "Orders")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long orderId;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal totalAmount;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status = Status.PENDING;
    
    @Column(name = "order_date")
    private LocalDateTime orderDate = LocalDateTime.now();
    
    @Column(name = "shipping_address", columnDefinition = "TEXT")
    private String shippingAddress;
    
    @Column(name = "billing_address", columnDefinition = "TEXT")
    private String billingAddress;
    
    @Column(name = "payment_method")
    private String paymentMethod;
    
    @Column(name = "customer_name")
    private String customerName;
    
    @Column(name = "email")
    private String email;
    
    @Column(name = "phone")
    private String phone;

    public enum Status {
        PENDING, PROCESSING, SHIPPED, DELIVERED, CANCELLED
    }

    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }
}
