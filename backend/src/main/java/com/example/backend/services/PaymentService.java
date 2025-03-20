package com.example.backend.services;

import com.example.backend.model.Payment;
import com.example.backend.repository.PaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PaymentService {

    @Autowired
    private PaymentRepository paymentRepository;

    // Create a new payment
    public Payment createPayment(Payment payment) {
        return paymentRepository.save(payment);
    }

    // Get all payments
    public List<Payment> getAllPayments() {
        return paymentRepository.findAll();
    }

    // Get payment by ID
    public Optional<Payment> getPaymentById(Long paymentId) {
        return paymentRepository.findById(paymentId);
    }

    // Update payment status
    public Payment updatePaymentStatus(Long paymentId, Payment.Status status) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new RuntimeException("Payment not found with id: " + paymentId));
        payment.setStatus(status);
        return paymentRepository.save(payment);
    }

    // Get payments by order ID
    public List<Payment> getPaymentsByOrderId(Long orderId) {
        return paymentRepository.findByOrder_OrderId(orderId);
    }

    // Get payments by status
    public List<Payment> getPaymentsByStatus(Payment.Status status) {
        return paymentRepository.findByStatus(status);
    }
}