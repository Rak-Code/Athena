package com.example.backend.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    // Generic method to send emails
    public void sendEmail(String toEmail, String subject, String messageBody) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject(subject);
        message.setText(messageBody);
        mailSender.send(message);
    }

    // Specific method for order confirmation
    public void sendOrderConfirmation(String toEmail, String orderId, double amount) {
        String subject = "Order Confirmation - Order ID: " + orderId;
        String message = "Dear Customer,\n\nYour order with ID " + orderId +
                " has been successfully placed.\nTotal Amount: ₹" + amount +
                "\n\nThank you for shopping with us!\n\nBest Regards,\nAthena Store";

        sendEmail(toEmail, subject, message);
    }
}
