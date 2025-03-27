
# Athena E-Commerce Platform

Athena is a full-stack e-commerce application for clothing products built with a Spring Boot backend and a React frontend. It offers robust features for user management, order processing, payment integration, email notifications, security configuration, and an integrated Chat Bot. This document covers every aspect of the project—from architecture and features to installation, configuration, troubleshooting, and future enhancements.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Key Features](#key-features)
  - [User Management](#user-management)
  - [Order Processing](#order-processing)
  - [Payment Integration](#payment-integration)
  - [Email Notifications](#email-notifications)
  - [Security](#security)
  - [Chat Bot Integration](#chat-bot-integration)
- [Architecture & Directory Structure](#architecture--directory-structure)
- [API Documentation](#api-documentation)
  - [User Endpoints](#user-endpoints)
  - [Order Endpoints](#order-endpoints)
  - [Payment Endpoints](#payment-endpoints)
  - [Chat Bot Endpoints](#chat-bot-endpoints)
- [Installation Guide](#installation-guide)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
  - [Database Setup](#database-setup)
- [Configuration](#configuration)
- [Troubleshooting](#troubleshooting)
- [Changelog](#changelog)
- [Future Enhancements](#future-enhancements)
- [Contribution Guidelines](#contribution-guidelines)
- [License](#license)

---

## Project Overview

Athena is designed to serve as a scalable and secure e-commerce solution. The backend is implemented using Spring Boot with RESTful APIs, while the frontend is developed with React to provide a dynamic user experience. The project integrates with Razorpay for payment processing, uses SMTP for email notifications, and now includes an intelligent Chat Bot to assist users with inquiries, product recommendations, and support. Comprehensive logging, error handling, and security features ensure a robust production-ready environment.

---

## Key Features

### User Management
- **Registration & Authentication:**  
  - Secure user registration with validation and password hashing using BCrypt.
  - Login endpoint for authentication.
- **Input Validation:**  
  - Email format verification, password complexity checks, and duplicate email prevention.
- **Role-Based Access:**  
  - Differentiated roles for customers and administrators (expandable as needed).

### Order Processing
- **Order Creation & Management:**  
  - Create orders with multiple items.
  - Order lifecycle management with status updates (e.g., Pending, Processing, Shipped, Delivered).
- **Transactional Integrity:**  
  - Orders are processed within transactions to maintain consistency.
- **Email Confirmation:**  
  - Automated email confirmations upon successful order creation.

### Payment Integration
- **Razorpay Integration:**  
  - Direct integration with Razorpay's payment gateway for secure transactions.
- **Payment Status Tracking:**  
  - Updates to payment statuses (Pending, Completed, Failed) based on webhook notifications.
- **Record Generation:**  
  - Automatic creation and logging of payment records linked to orders.

### Email Notifications
- **Transactional Emails:**  
  - Order confirmations, payment receipts, and other notifications sent via SMTP.
- **Error Handling & Logging:**  
  - Robust error detection and logging in case of failures in email delivery.

### Security
- **CORS Configuration:**  
  - Proper CORS policies are set up to protect API endpoints.
- **Password Security:**  
  - Passwords are encrypted using BCrypt.
- **Secure Endpoints:**  
  - Role-based access control and secure headers are enforced.
- **Additional Protections:**  
  - CSRF protection and input sanitization are in place.

### Chat Bot Integration
- **Overview:**  
  - An intelligent Chat Bot is integrated to provide real-time assistance. Users can ask questions about products, orders, payment issues, and general site navigation.
- **Backend Implementation:**  
  - The Chat Bot functionality is implemented as a REST endpoint in the Spring Boot backend. It can use either a rule-based system or integrate with third-party NLP services for more advanced responses.
- **Frontend Integration:**  
  - The Chat Bot is embedded as a React component that can be accessed from any page. It features a user-friendly interface with real-time messaging.
- **Features:**  
  - Natural language understanding for common queries.
  - Quick replies and suggestion buttons.
  - Escalation to human support if necessary.
- **API Endpoint:**  
  - A dedicated endpoint (e.g., `/api/chat/send`) handles incoming messages and returns responses.

---

## Architecture & Directory Structure

The project is organized into two main parts: the backend and the frontend.

### Backend (Spring Boot)
```
backend/
├── src/main/java/com/athena
│   ├── config/            # Security, CORS, and other configurations
│   ├── controller/        # REST API controllers (UserController, OrderController, PaymentController, ChatController, etc.)
│   ├── dto/               # Data Transfer Objects
│   ├── model/             # JPA Entity Models (User, Order, Payment, etc.)
│   ├── repository/        # Spring Data repositories for CRUD operations
│   ├── services/          # Business logic and service layer (EmailService, OrderService, PaymentService, ChatBotService, etc.)
│   └── utils/             # Helper classes and utilities
└── src/main/resources/
    ├── application.properties  # Configuration settings
    └── static/              # Static assets or documentation (if applicable)
```

### Frontend (React)
```
frontend/
├── public/                   # Static files (HTML, images, etc.)
└── src/
    ├── components/           # Reusable React components (including ChatBotComponent)
    ├── pages/                # Page-level views and layouts
    ├── services/             # API service calls (Chat service integration included)
    ├── utils/                # Helper functions and constants
    └── App.jsx               # Main application component
```

### Database
- **MySQL:**  
  - The relational database stores all application data such as users, orders, payment records, and chat logs (if applicable).
  - Schema scripts can be found in the `/database` folder if provided.

---

## API Documentation

### User Endpoints

| Method | Path                     | Description                             | Example Payload                                                  |
|--------|--------------------------|-----------------------------------------|------------------------------------------------------------------|
| POST   | `/api/users/register`    | Register a new user                     | `{ "email": "user@example.com", "password": "Password123" }`     |
| POST   | `/api/users/login`       | Authenticate user and generate token    | `{ "email": "user@example.com", "password": "Password123" }`     |

### Order Endpoints

| Method | Path                         | Description                        | Example Payload                                                                 |
|--------|------------------------------|------------------------------------|---------------------------------------------------------------------------------|
| POST   | `/api/orders`                | Create a new order                 | `{ "userId": 1, "items": [{ "productId": 10, "quantity": 2 }] }`                  |
| GET    | `/api/orders`                | Retrieve all orders                | -                                                                               |
| PUT    | `/api/orders/{id}/status`    | Update order status                | `{ "status": "Shipped" }`                                                         |

### Payment Endpoints

| Method | Path                              | Description                                       | Example Payload                                                                 |
|--------|-----------------------------------|---------------------------------------------------|---------------------------------------------------------------------------------|
| POST   | `/api/payments/update`            | Update payment status (via Razorpay webhook)      | `{ "orderId": 1, "status": "Completed", "transactionId": "txn_12345" }`           |

### Chat Bot Endpoints

| Method | Path                   | Description                                    | Example Payload                                                   |
|--------|------------------------|------------------------------------------------|-------------------------------------------------------------------|
| POST   | `/api/chat/send`       | Send a chat message and receive a response     | `{ "message": "What are today's deals?" }`                        |

*Note: The Chat Bot endpoint can be extended to support conversation history or additional functionalities as required.*

---

## Installation Guide

### Prerequisites
- **Java 17+**
- **Node.js 16+**
- **MySQL 8+**
- **Maven** (for backend dependency management)

### Backend Setup

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/yourusername/athena.git
   cd athena/backend
   ```

2. **Configure Application Properties:**  
   Update `src/main/resources/application.properties` with your database, email, and Razorpay credentials.
   ```properties
   # Database configuration
   spring.datasource.url=jdbc:mysql://localhost:3306/athena
   spring.datasource.username=your_db_username
   spring.datasource.password=your_db_password

   # Email configuration
   spring.mail.host=smtp.gmail.com
   spring.mail.port=587
   spring.mail.username=your-email@gmail.com
   spring.mail.password=your-email-password

   # Razorpay keys
   razorpay.key_id=your_razorpay_key_id
   razorpay.key_secret=your_razorpay_key_secret

   # Logging configuration
   logging.level.org.springframework=INFO
   logging.level.com.athena=DEBUG
   ```

3. **Build and Run:**
   ```bash
   mvn clean install
   mvn spring-boot:run
   ```

### Frontend Setup

1. **Navigate to the Frontend Directory:**
   ```bash
   cd ../frontend
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Start the Development Server:**
   ```bash
   npm start
   ```

### Database Setup

1. **Install MySQL:**  
   Ensure MySQL 8+ is installed and running on your system.

2. **Create the Database:**
   ```sql
   CREATE DATABASE athena;
   ```

3. **Run Schema Script:**  
   If provided, execute the schema SQL file located in the `/database` folder to create tables and seed initial data.

---

## Configuration

The application is highly configurable via the `application.properties` file (backend) and environment variables (frontend). Key configuration parameters include:

- **Database Connection:**  
  Ensure the correct URL, username, and password are provided.
- **Email Server:**  
  Configure SMTP settings for sending transactional emails.
- **Payment Gateway:**  
  Razorpay API keys must be set for processing payments.
- **Chat Bot Settings:**  
  Optionally configure any third-party NLP or AI integration settings for the Chat Bot service.
- **Logging Levels:**  
  Adjust logging levels to enable detailed debug information during development or troubleshooting.

---

## Troubleshooting

### Common Issues & Solutions

1. **Email Delivery Failures:**
   - Verify SMTP credentials and network connectivity.
   - If using Gmail, ensure “less secure apps” access is enabled or use an app-specific password.
   - Check application logs for SMTP error details.

2. **Payment Integration Issues:**
   - Confirm that the Razorpay API keys are correct and active.
   - Ensure that the webhook URL is correctly configured and accessible.
   - Inspect SSL certificates if deploying in production mode.

3. **Database Connectivity Errors:**
   - Make sure the MySQL service is running.
   - Double-check the connection URL, username, and password in `application.properties`.
   - Verify that the required JDBC driver is included in the project dependencies.

4. **CORS Issues:**
   - Confirm that CORS is properly configured in the Spring Boot security configuration.
   - Check the browser console for detailed error messages and adjust the allowed origins accordingly.

5. **Chat Bot Issues:**
   - Verify the Chat Bot service endpoint is correctly implemented and running.
   - Check the integration settings if using external NLP services.
   - Review network logs to ensure messages are correctly sent and responses received.

---

## Changelog

### Version 1.0.0 - Initial Release
- **User Management:** Implemented registration, login, and role-based access.
- **Order Processing:** Added order creation, management, and transactional integrity.
- **Payment Integration:** Integrated Razorpay with webhook support for payment status updates.
- **Email Notifications:** Configured SMTP-based email notifications with error handling.
- **Security Enhancements:** Set up CORS, BCrypt password encoding, and secure endpoints.
- **Chat Bot Integration:** Implemented a Chat Bot REST endpoint and integrated the Chat Bot UI in the frontend.
- **Logging:** Added detailed logging across controllers and services.

*Future changes will be documented in subsequent version updates.*

---

## Future Enhancements

- [ ] **Password Reset:** Add functionality for users to reset their passwords.
- [ ] **Admin Dashboard:** Create an admin interface for managing orders, payments, and users.
- [ ] **Inventory Management:** Integrate a module for product inventory control.
- [ ] **Shipping Integration:** Support third-party shipping APIs.
- [ ] **Product Reviews:** Enable customers to leave reviews and ratings.
- [ ] **Multi-Payment Support:** Expand beyond Razorpay to include other payment gateways.
- [ ] **Advanced Chat Bot:** Enhance Chat Bot capabilities with context-aware conversation and support for additional languages.

---

## Contribution Guidelines

Contributions are welcome! Please follow these steps to contribute:
1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Write tests for your changes where applicable.
4. Submit a pull request with a detailed description of your changes.
5. Follow the existing code style and document your updates in the README if necessary.

---

## License

This project is licensed under the [MIT License](LICENSE).

