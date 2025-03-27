package com.example.backend.services;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

    @Autowired
    private JavaMailSender mailSender;

    // Generic method to send emails
    public void sendEmail(String toEmail, String subject, String messageBody) {
        try {
            logger.info("Attempting to send email to: {}", toEmail);
            logger.debug("Email subject: {}", subject);
            logger.debug("Email body: {}", messageBody);

            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(toEmail);
            message.setSubject(subject);
            message.setText(messageBody);
            message.setFrom("webcoderak@gmail.com"); // Set the from address

            mailSender.send(message);
            logger.info("Email sent successfully to: {}", toEmail);
        } catch (Exception e) {
            logger.error("Failed to send email to: {}", toEmail, e);
            throw e; // Re-throw to handle it in the calling service
        }
    }

    // Specific method for order confirmation
    public void sendOrderConfirmation(String toEmail, String orderId, double amount) {
        try {
            logger.info("Preparing order confirmation email for order: {}", orderId);
            
            String subject = "Order Confirmation - Order ID: " + orderId;
            String message = "Dear Customer,\n\nYour order with ID " + orderId +
                    " has been successfully placed.\nTotal Amount: ₹" + amount +
                    "\n\nThank you for shopping with us!\n\nBest Regards,\nAthena Store";

            sendEmail(toEmail, subject, message);
            logger.info("Order confirmation email sent successfully for order: {}", orderId);
        } catch (Exception e) {
            logger.error("Failed to send order confirmation email for order: {}", orderId, e);
            throw e;
        }
    }
}
