package com.example.backend.services;

import com.example.backend.model.Payment;
import com.example.backend.repository.PaymentRepository;
import com.example.backend.services.EmailService;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PaymentService {

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private EmailService emailService; // Inject EmailService

    @Value("${razorpay.key_id}")
    private String keyId;

    @Value("${razorpay.key_secret}")
    private String keySecret;

    private static final String CURRENCY = "INR";

    // Create Razorpay Order
    public String createRazorpayOrder(int amount) throws RazorpayException {
        RazorpayClient razorpayClient = new RazorpayClient(keyId, keySecret);

        JSONObject options = new JSONObject();
        options.put("amount", amount * 100); // Amount in paisa
        options.put("currency", CURRENCY);
        options.put("payment_capture", 1); // Auto-capture

        Order order = razorpayClient.orders.create(options);
        return order.toString(); // Return Razorpay order JSON
    }

    // Save payment details after order creation and send confirmation email
    public Payment createPayment(Payment payment) {
        System.out.println("Creating Payment with email: " + payment.getEmail());
        Payment savedPayment = paymentRepository.save(payment);
        sendPaymentConfirmationEmail(savedPayment);
        return savedPayment;
    }


    // Get all payments
    public List<Payment> getAllPayments() {
        return paymentRepository.findAll();
    }

    // Get payment by ID
    public Optional<Payment> getPaymentById(Long paymentId) {
        return paymentRepository.findById(paymentId);
    }

    // Update payment status and notify user
    public Payment updatePaymentStatus(Long paymentId, Payment.Status status) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new RuntimeException("Payment not found with id: " + paymentId));
        payment.setStatus(status);
        Payment updatedPayment = paymentRepository.save(payment);

        sendPaymentStatusUpdateEmail(updatedPayment);
        return updatedPayment;
    }

    // Get payments by order ID
    public List<Payment> getPaymentsByOrderId(Long orderId) {
        return paymentRepository.findByOrder_OrderId(orderId);
    }

    // Get payments by status
    public List<Payment> getPaymentsByStatus(Payment.Status status) {
        return paymentRepository.findByStatus(status);
    }

    // Send email for payment confirmation
    private void sendPaymentConfirmationEmail(Payment payment) {
        String subject = "Payment Confirmation";
        String message = "Dear customer,\n\nYour payment of INR " + payment.getAmount() +
                " using " + payment.getPaymentMethod() + " has been received successfully.\n" +
                "Transaction ID: " + payment.getTransactionId() + "\n\nThank you for your purchase!";

        emailService.sendEmail(payment.getEmail(), subject, message);
    }

    // Send email when payment status is updated
    private void sendPaymentStatusUpdateEmail(Payment payment) {
        String subject = "Payment Status Update";
        String message = "Dear customer,\n\nYour payment status has been updated to: " + payment.getStatus() +
                ".\nTransaction ID: " + payment.getTransactionId() + "\n\nThank you!";

        emailService.sendEmail(payment.getEmail(), subject, message);
    }
}
