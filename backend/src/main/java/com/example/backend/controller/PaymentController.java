package com.example.backend.controller;

import com.example.backend.model.Payment;
import com.example.backend.services.EmailService;
import com.example.backend.services.PaymentService;
import com.razorpay.RazorpayException;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = "http://localhost:5173")
public class PaymentController {

    private static final Logger logger = LoggerFactory.getLogger(PaymentController.class);

    @Autowired
    private PaymentService paymentService;

    @Value("${razorpay.key_id}")
    private String razorpayKey;

    @Value("${razorpay.key_secret}")
    private String razorpaySecret;

    @Autowired
    private EmailService emailService;

    @GetMapping("/test-email")
    public String testEmail() {
        emailService.sendEmail("rakeshgupta1361411@gmail.com", "Test Email", "This is a test email.");
        return "Email sent!";
    }


    // Create Razorpay order and return order details
    @PostMapping(value = "/create-order",
            produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> createOrder(@RequestParam double amount) {
        try {
            logger.info("Creating Razorpay order for amount in rupees: {}", amount);

            if (razorpayKey == null || razorpaySecret == null) {
                logger.error("Razorpay API keys are missing. Set them in environment variables.");
                return ResponseEntity.badRequest().body(Map.of("error", "Razorpay API keys are missing."));
            }

            // Create Razorpay client
            com.razorpay.RazorpayClient razorpay = new com.razorpay.RazorpayClient(razorpayKey, razorpaySecret);

            // Convert amount to paise (1 INR = 100 paise)
            int amountInPaise = (int) Math.round(amount * 100);

            // Order request
            JSONObject orderRequest = new JSONObject();
            orderRequest.put("amount", amountInPaise);
            orderRequest.put("currency", "INR");
            orderRequest.put("receipt", "order_" + System.currentTimeMillis());

            // Create order
            com.razorpay.Order order = razorpay.orders.create(orderRequest);

            // Convert order data to a plain Java Map
            Map<String, Object> response = new HashMap<>();
            response.put("id", order.get("id"));
            response.put("amount", amountInPaise); // Amount in paise
            response.put("currency", "INR");
            response.put("receipt", order.get("receipt"));

            logger.info("Successfully created Razorpay order: {}", response);
            return ResponseEntity.ok(response);

        } catch (RazorpayException e) {
            logger.error("Error creating Razorpay order: {}", e.getMessage());
            Map<String, String> error = new HashMap<>();
            error.put("message", "Error creating Razorpay order: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        } catch (Exception e) {
            logger.error("Unexpected error creating order: {}", e.getMessage());
            Map<String, String> error = new HashMap<>();
            error.put("message", "Unexpected error: " + e.getMessage());
            return ResponseEntity.status(500).body(error);
        }
    }

    // Create a new payment record
    // Note: PaymentService.createPayment() now sends an email confirmation upon successful creation.
    @PostMapping
    public ResponseEntity<Payment> createPayment(@RequestBody Payment payment) {
        logger.info("Creating new payment: {}", payment);
        Payment createdPayment = paymentService.createPayment(payment);
        return ResponseEntity.ok(createdPayment);
    }

    // Get all payments
    @GetMapping
    public ResponseEntity<List<Payment>> getAllPayments() {
        logger.info("Fetching all payments");
        List<Payment> payments = paymentService.getAllPayments();
        return ResponseEntity.ok(payments);
    }

    // Get payment by ID
    @GetMapping("/{paymentId}")
    public ResponseEntity<Payment> getPaymentById(@PathVariable Long paymentId) {
        logger.info("Fetching payment with ID: {}", paymentId);
        return paymentService.getPaymentById(paymentId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Update payment status
    // Note: PaymentService.updatePaymentStatus() now sends an email when the payment status is updated.
    @PutMapping("/{paymentId}/status")
    public ResponseEntity<?> updatePaymentStatus(@PathVariable Long paymentId, @RequestParam Payment.Status status) {
        logger.info("Updating payment status for ID: {} to {}", paymentId, status);
        try {
            Payment updatedPayment = paymentService.updatePaymentStatus(paymentId, status);
            return ResponseEntity.ok(updatedPayment);
        } catch (Exception e) {
            logger.error("Error updating payment status: {}", e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", "Failed to update status", "details", e.getMessage()));
        }
    }

    // Get payments by order ID
    @GetMapping("/order/{orderId}")
    public ResponseEntity<List<Payment>> getPaymentsByOrderId(@PathVariable Long orderId) {
        logger.info("Fetching payments for order ID: {}", orderId);
        List<Payment> payments = paymentService.getPaymentsByOrderId(orderId);
        return ResponseEntity.ok(payments);
    }

    // Get payments by status
    @GetMapping("/status/{status}")
    public ResponseEntity<List<Payment>> getPaymentsByStatus(@PathVariable Payment.Status status) {
        logger.info("Fetching payments with status: {}", status);
        List<Payment> payments = paymentService.getPaymentsByStatus(status);
        return ResponseEntity.ok(payments);
    }

    @PostMapping("/update")
    public ResponseEntity<?> updatePayment(@RequestBody Map<String, String> paymentDetails) {
        try {
            // Extract payment details
            String orderId = paymentDetails.get("orderId");
            String paymentId = paymentDetails.get("paymentId");
            String razorpayOrderId = paymentDetails.get("razorpayOrderId");
            String status = paymentDetails.get("status");
            String amountStr = paymentDetails.get("amount");

            if (orderId == null || paymentId == null) {
                throw new IllegalArgumentException("Order ID and Payment ID are required");
            }

            // Find payment by order ID
            List<Payment> payments = paymentService.getPaymentsByOrderId(Long.parseLong(orderId));
            if (payments.isEmpty()) {
                throw new RuntimeException("No payment found for order ID: " + orderId);
            }

            Payment payment = payments.get(0);
            payment.setTransactionId(paymentId);
            payment.setStatus(Payment.Status.valueOf(status));

            // Update payment
            Payment updatedPayment = paymentService.createPayment(payment);

            // Create response
            Map<String, Object> response = new HashMap<>();
            response.put("status", "success");
            response.put("orderId", orderId);
            response.put("paymentId", paymentId);
            response.put("message", "Payment updated successfully");

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Error updating payment: {}", e.getMessage());
            Map<String, String> error = new HashMap<>();
            error.put("message", "Error updating payment: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
}
