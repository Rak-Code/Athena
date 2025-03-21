# Athena - E-commerce Admin Panel

Athena is a full-stack e-commerce application with a robust admin panel for managing products, orders, payments, categories, shopping carts, wishlists, and user accounts. This project includes a React frontend and a Spring Boot backend.

---

## Features

### Admin Panel
- **Dashboard**: View key metrics like total orders, pending orders, and recent transactions.
- **Product Management**:
  - Add new products
  - Edit existing products
  - Delete products
- **Order Management**:
  - View all orders
  - Update order status
  - Filter orders by status
- **User Authentication**:
  - Admin login with role-based access control
  - Protected routes for admin-only pages

### Frontend
- **React.js**: Built with functional components and hooks.
- **React Router**: For client-side routing.
- **Axios**: For API calls to the backend.
- **Bootstrap**: For responsive and modern UI components.
- **Protected Routes**: Role-based access control for admin pages.

### Backend
- **Spring Boot**: RESTful API for handling requests.
- **JWT Authentication**: Secure login and role-based access.
- **API Endpoints**:
  - `/api/products`: CRUD operations for products.
  - `/api/orders`: CRUD operations for orders.
  - `/api/users`: User registration and login.
  - `/api/payments`: Manage payments.
  - `/api/categories`: Product category management.
  - `/api/cart`: Shopping cart management.
  - `/api/wishlist`: Wishlist management.
  - `/api/reviews`: User reviews on products.

### Recent Features and Improvements
- **Product Browsing**:
  - View products with detailed information and images
  - Search and filter products
  - Product categories and subcategories
  - Product reviews and ratings
- **Shopping Cart**:
  - Add/remove items from cart
  - Update quantities
  - Calculate total price with discounts
  - View cart summary
- **Wishlist**:
  - Save products for later
  - View and manage wishlist items
  - Consistent handling of product IDs
  - Improved error handling
- **Order Management**:
  - Place orders with multiple items
  - View order history
  - Track order status
  - Order confirmation page
  - Order details with item breakdown
- **User Profile**:
  - View and edit profile information
  - View order history
  - Manage wishlist
  - View and manage reviews
  - Contact us form
  - Dark theme UI
- **Authentication**:
  - User registration and login
  - Secure password hashing
  - JWT-based authentication
  - Role-based access control

---

## Project Structure

### Frontend (`frontend/src`)
- **Components**:
  - `ProtectedRoute.jsx`: Handles role-based access control.
  - `NavigationBar.jsx`: Main navigation bar with login/logout functionality.
  - `CarouselComponent.jsx`: Home page carousel.
- **Pages**:
  - `Home.jsx`: Main landing page.
  - `Login.jsx`: Admin login page.
  - `Register.jsx`: User registration page.
  - `admin/`:
    - `AdminLayout.jsx`: Layout for admin pages.
    - `Dashboard.jsx`: Admin dashboard.
    - `Products.jsx`: Product management.
    - `AddProduct.jsx`: Add new products.
    - `EditProduct.jsx`: Edit existing products.
    - `Orders.jsx`: Order management.
- **Context**:
  - `CartContext.jsx`: Manages cart state.
- **Styles**:
  - CSS files for styling components.

### Backend (`BackendFirst`)
- **Controllers**:
  - `ProductController.java`: Handles product-related requests.
  - `OrderController.java`: Handles order-related requests.
  - `UserController.java`: Handles user authentication and registration.
  - `PaymentController.java`: Handles payment processing.
  - `CategoryController.java`: Handles product categories.
  - `ShoppingCartController.java`: Manages shopping cart functionality.
  - `WishlistController.java`: Manages user wishlists.
  - `ReviewController.java`: Handles product reviews.
  - `OrderDetailController.java`: Handles order details.
- **Models**:
  - `Product.java`, `Order.java`, `User.java`, `Category.java`, `Payment.java`, `Cart.java`, `Wishlist.java`, `Review.java`, `OrderDetail.java`: Entity classes.
- **Repositories**:
  - Data access layers for all entities.
- **Security**:
  - `JwtAuthenticationFilter.java`: Handles JWT authentication.
  - `SecurityConfig.java`: Configures Spring Security.

---

## Setup Instructions

### Frontend
1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm start
   ```

### Backend
1. Open the `BackendFirst` project in your IDE (e.g., IntelliJ IDEA).
2. Configure the database in `application.properties`.
3. Run the Spring Boot application.

---

## Environment Variables

### Frontend
Create a `.env` file in the `frontend` directory:
```
REACT_APP_API_URL=http://localhost:8080
```

### Backend
Configure `application.properties`:
```
spring.datasource.url=jdbc:mysql://localhost:3306/athena
spring.datasource.username=root
spring.datasource.password=yourpassword
spring.jpa.hibernate.ddl-auto=update
jwt.secret=your_jwt_secret
```

---

## API Documentation

### User Controller
- `GET /api/users/{userId}`
- `PUT /api/users/{userId}`
- `DELETE /api/users/{userId}`
- `GET /api/users`
- `POST /api/users`
- `POST /api/users/login`
- `GET /api/users/username/{username}`
- `GET /api/users/email/{email}`

### Review Controller
- `GET /api/reviews/{reviewId}`
- `PUT /api/reviews/{reviewId}`
- `DELETE /api/reviews/{reviewId}`
- `GET /api/reviews`
- `POST /api/reviews`
- `GET /api/reviews/user/{userId}`
- `GET /api/reviews/product/{productId}`

### Product Controller
- `GET /api/products/{productId}`
- `PUT /api/products/{productId}`
- `DELETE /api/products/{productId}`
- `GET /api/products`
- `POST /api/products`
- `GET /api/products/search/{name}`
- `GET /api/products/filter`
- `GET /api/products/category/{categoryId}`

### Payment Controller
- `PUT /api/payments/{paymentId}/status`
- `GET /api/payments`
- `POST /api/payments`
- `GET /api/payments/{paymentId}`
- `GET /api/payments/status/{status}`
- `GET /api/payments/order/{orderId}`

### Order Controller
- `PUT /api/orders/{orderId}/status`
- `GET /api/orders`
- `POST /api/orders`
- `GET /api/orders/{orderId}`
- `DELETE /api/orders/{orderId}`
- `GET /api/orders/user/{userId}`
- `GET /api/orders/status/{status}`

### Category Controller
- `GET /api/categories/{categoryId}`
- `PUT /api/categories/{categoryId}`
- `DELETE /api/categories/{categoryId}`
- `GET /api/categories`
- `POST /api/categories`
- `GET /api/categories/{categoryId}/with-products`
- `GET /api/categories/with-products`
- `GET /api/categories/search/{name}`
- `GET /api/categories/name/{name}`

### Shopping Cart Controller
- `PUT /api/cart/{cartId}`
- `DELETE /api/cart/{cartId}`
- `POST /api/cart`
- `GET /api/cart/user/{userId}`

### Wishlist Controller
- `POST /api/wishlist`
- `GET /api/wishlist/user/{userId}`
- `DELETE /api/wishlist/{wishlistId}`

### Order Detail Controller
- `POST /api/order-details`
- `GET /api/order-details/order/{orderId}`

### Authentication
- `POST /api/auth/login`: User login
- `POST /api/auth/register`: User registration
- `GET /api/auth/verify`: Token verification

### Products
- `GET /api/products`: List products
- `GET /api/products/{id}`: Get product details
- `POST /api/products`: Add new product
- `PUT /api/products/{id}`: Update product
- `DELETE /api/products/{id}`: Delete product

### Orders
- `POST /api/orders`: Create order
- `GET /api/orders`: List orders
- `GET /api/orders/{id}`: Get order details
- `PUT /api/orders/{id}/status`: Update order status

### Cart
- `POST /api/cart`: Add to cart
- `GET /api/cart/{userId}`: Get cart items
- `PUT /api/cart/{id}`: Update cart item
- `DELETE /api/cart/{id}`: Remove from cart

### Wishlist
- `POST /api/wishlist`: Add to wishlist
- `GET /api/wishlist/{userId}`: Get wishlist
- `DELETE /api/wishlist/{id}`: Remove from wishlist

### Reviews
- `POST /api/reviews`: Add review
- `GET /api/reviews/product/{productId}`: Get product reviews
- `PUT /api/reviews/{id}`: Update review
- `DELETE /api/reviews/{id}`: Delete review

---

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

---

## License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## Acknowledgments

- React Bootstrap for UI components
- Spring Boot for backend framework
- JWT for authentication
- MySQL for database management
