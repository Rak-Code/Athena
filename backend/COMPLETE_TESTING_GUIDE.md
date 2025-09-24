# Complete E-Commerce Backend Testing Flow
**QA Testing Guide for Athena E-Commerce Platform**

## Overview
This comprehensive testing guide provides a step-by-step end-to-end testing flow for the Athena E-Commerce Backend API. As a Software Test Analyst, follow this sequential testing methodology to validate all business logic, data dependencies, and system integrations.

**Environment Configuration:**
- **Base URL:** `http://localhost:8080`
- **Frontend CORS Origin:** `http://localhost:5173`
- **Database:** MySQL (athena schema)
- **Authentication:** Session-based (no JWT tokens required)
- **Payment Gateway:** Razorpay Integration
- **Email Service:** Spring Mail SMTP

**Testing Scope:** Complete CRUD operations across all modules with relational data validation

---

## Critical Testing Prerequisites

### System Requirements
1. **Application Status:** Backend service running on port 8080
2. **Database Connectivity:** MySQL server active with 'athena' database
3. **Email Configuration:** SMTP settings configured for notification testing
4. **Payment Gateway:** Razorpay API keys configured in application.properties

### Data Dependencies and Constraints
- **User IDs** generated during registration are required for all user-specific operations
- **Product IDs** must exist before adding to cart or creating orders
- **Category IDs** are mandatory for product creation
- **Order IDs** are required for payment processing
- **Address validation** requires complete address information for order processing

### Testing Data Cleanup
- Each test execution may create persistent data in MySQL
- Consider database state between test runs
- Primary keys auto-increment and cannot be reset without database operations

---

## Testing Execution Flow

### Phase 1: User Management

### TEST CASE 1.1: User Registration (Positive Flow)
**Objective:** Validate new user account creation with valid data
**Business Logic:** Creates new user account with encrypted password and default USER role
**Prerequisites:** None (entry point for new users)

**HTTP Method:** `POST`
**Endpoint:** `/api/users/register`
**Authorization:** None required

**Request Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
    "username": "testuser001",
    "email": "testuser001@example.com",
    "password": "SecurePass123!"
}
```

**Expected Response (HTTP 200):**
```json
{
    "userId": 1,
    "username": "testuser001",
    "email": "testuser001@example.com",
    "role": "USER"
}
```

**Critical Test Data:**
- **Save userId:** `1` (Required for all subsequent user-specific operations)
- **Password:** Automatically encrypted using BCrypt
- **Role:** Defaults to USER (ADMIN/SUPER_ADMIN require manual database modification)

**Data Validation Rules:**
- Username: Required, unique, max 50 characters
- Email: Required, unique, valid email format, max 100 characters
- Password: Required, stored as encrypted hash

---

### TEST CASE 1.2: User Registration (Negative Flow - Duplicate Username)
**Objective:** Validate system rejection of duplicate username

**HTTP Method:** `POST`
**Endpoint:** `/api/users/register`

**Request Body:**
```json
{
    "username": "testuser001",
    "email": "different@example.com",
    "password": "AnotherPass123!"
}
```

**Expected Response (HTTP 400):**
```json
{
    "message": "Username already exists"
}
```

---

### TEST CASE 1.3: User Registration (Negative Flow - Duplicate Email)
**Objective:** Validate system rejection of duplicate email

**HTTP Method:** `POST`
**Endpoint:** `/api/users/register`

**Request Body:**
```json
{
    "username": "differentuser",
    "email": "testuser001@example.com",
    "password": "AnotherPass123!"
}
```

**Expected Response (HTTP 400):**
```json
{
    "message": "Email already exists"
}
```

---

### TEST CASE 1.4: User Registration (Negative Flow - Missing Required Fields)
**Objective:** Validate required field validation

**HTTP Method:** `POST`
**Endpoint:** `/api/users/register`

**Request Body:**
```json
{
    "username": "",
    "email": "test@example.com",
    "password": "password123"
}
```

**Expected Response (HTTP 400):**
```json
{
    "message": "Username is required"
}
```

### TEST CASE 1.5: User Authentication (Login)
**Objective:** Validate user authentication with valid credentials
**Business Logic:** Authenticates user credentials using BCrypt password verification
**Prerequisites:** Valid user account from TEST CASE 1.1

**HTTP Method:** `POST`
**Endpoint:** `/api/users/login`
**Authorization:** None required

**Request Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
    "email": "testuser001@example.com",
    "password": "SecurePass123!"
}
```

**Expected Response (HTTP 200):**
```json
{
    "userId": 1,
    "username": "testuser001",
    "email": "testuser001@example.com",
    "role": "USER"
}
```

**Critical Notes:**
- **Session Management:** Response contains user session data (no JWT tokens)
- **Password Security:** Passwords are never returned in response
- **Authentication State:** Successful login enables access to protected endpoints

---

### TEST CASE 1.6: User Authentication (Negative Flow - Invalid Credentials)
**Objective:** Validate system rejection of invalid credentials

**HTTP Method:** `POST`
**Endpoint:** `/api/users/login`

**Request Body:**
```json
{
    "email": "testuser001@example.com",
    "password": "WrongPassword123!"
}
```

**Expected Response (HTTP 401):**
```json
{
    "message": "Invalid credentials"
}
```

---

### TEST CASE 1.7: Get User Profile
**Objective:** Retrieve user information by ID
**Business Logic:** Returns user details (password excluded for security)
**Prerequisites:** Valid userId from registration

**HTTP Method:** `GET`
**Endpoint:** `/api/users/1`
**Authorization:** Session-based (user must be authenticated)

**Expected Response (HTTP 200):**
```json
{
    "userId": 1,
    "username": "testuser001",
    "email": "testuser001@example.com",
    "role": "USER"
}
```

**Data Dependencies:**
- **userId:** Must correspond to existing user record
- **Security:** Password field excluded from response

---

## Phase 2: Product Catalog Management

### TEST CASE 2.1: Create Product Category
**Objective:** Establish product categorization structure
**Business Logic:** Creates category for product organization and filtering
**Prerequisites:** None (categories are independent entities)

**HTTP Method:** `POST`
**Endpoint:** `/api/categories`
**Authorization:** Session-based (authenticated user required)

**Request Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
    "name": "Electronics",
    "description": "Electronic devices, gadgets, and accessories"
}
```

**Expected Response (HTTP 200):**
```json
{
    "categoryId": 1,
    "name": "Electronics",
    "description": "Electronic devices, gadgets, and accessories"
}
```

**Critical Test Data:**
- **Save categoryId:** `1` (Required for product creation)
- **Uniqueness:** Category names should be unique (business constraint)

**Data Validation Rules:**
- Name: Required, max 100 characters
- Description: Optional, TEXT type (unlimited length)

---

### TEST CASE 2.2: Create Additional Categories
**Objective:** Create multiple categories for comprehensive testing

**HTTP Method:** `POST`
**Endpoint:** `/api/categories`

**Request Body (Category 2):**
```json
{
    "name": "Clothing",
    "description": "Fashion apparel and accessories"
}
```

**Expected Response (HTTP 200):**
```json
{
    "categoryId": 2,
    "name": "Clothing",
    "description": "Fashion apparel and accessories"
}
```

**Save categoryId:** `2`

---

### TEST CASE 2.3: Get All Categories
**Objective:** Validate category retrieval functionality
**Business Logic:** Returns all available product categories

**HTTP Method:** `GET`
**Endpoint:** `/api/categories`
**Authorization:** Session-based

**Expected Response (HTTP 200):**
```json
[
    {
        "categoryId": 1,
        "name": "Electronics",
        "description": "Electronic devices, gadgets, and accessories"
    },
    {
        "categoryId": 2,
        "name": "Clothing",
        "description": "Fashion apparel and accessories"
    }
]
```

### TEST CASE 2.4: Create Product (Electronics Category)
**Objective:** Add product to electronics category with complete product information
**Business Logic:** Creates product entity with price, inventory, and category association
**Prerequisites:** Valid categoryId from TEST CASE 2.1

**HTTP Method:** `POST`
**Endpoint:** `/api/products`
**Authorization:** Session-based (authenticated user required)

**Request Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
    "name": "iPhone 15 Pro Max",
    "description": "Latest iPhone with A17 Pro chip, titanium design, and advanced camera system",
    "price": 1199.99,
    "stockQuantity": 50,
    "size": "L",
    "imageUrl": "https://example.com/images/iphone15promax.jpg",
    "category": {
        "categoryId": 1
    }
}
```

**Expected Response (HTTP 200):**
```json
{
    "productId": 1,
    "name": "iPhone 15 Pro Max",
    "description": "Latest iPhone with A17 Pro chip, titanium design, and advanced camera system",
    "price": 1199.99,
    "stockQuantity": 50,
    "size": "L",
    "imageUrl": "https://example.com/images/iphone15promax.jpg"
}
```

**Critical Test Data:**
- **Save productId:** `1` (Required for cart, orders, reviews, wishlist)
- **Price Format:** BigDecimal with 2 decimal precision
- **Stock Management:** Integer value for inventory tracking

**Data Validation Rules:**
- Name: Required, max 100 characters
- Price: Required, BigDecimal (10,2)
- StockQuantity: Required, non-negative integer
- Category: Required foreign key relationship
- Size: Enum values (S, M, L, XL, XXL)

**Relational Constraints:**
- **categoryId:** Must reference existing Category record
- **Foreign Key Integrity:** Category deletion restricted if products exist

---

### TEST CASE 2.5: Create Product (Clothing Category)
**Objective:** Add product to clothing category for multi-category testing
**Prerequisites:** Valid categoryId from TEST CASE 2.2

**HTTP Method:** `POST`
**Endpoint:** `/api/products`

**Request Body:**
```json
{
    "name": "Premium Cotton T-Shirt",
    "description": "100% organic cotton t-shirt with comfortable fit",
    "price": 29.99,
    "stockQuantity": 100,
    "size": "M",
    "imageUrl": "https://example.com/images/cotton-tshirt.jpg",
    "category": {
        "categoryId": 2
    }
}
```

**Expected Response (HTTP 200):**
```json
{
    "productId": 2,
    "name": "Premium Cotton T-Shirt",
    "description": "100% organic cotton t-shirt with comfortable fit",
    "price": 29.99,
    "stockQuantity": 100,
    "size": "M",
    "imageUrl": "https://example.com/images/cotton-tshirt.jpg"
}
```

**Save productId:** `2`

### TEST CASE 2.6: Product Creation (Negative Flow - Invalid Category)
**Objective:** Validate foreign key constraint enforcement
**Business Logic:** System should reject products with non-existent category references

**HTTP Method:** `POST`
**Endpoint:** `/api/products`

**Request Body:**
```json
{
    "name": "Invalid Product",
    "description": "Product with invalid category",
    "price": 99.99,
    "stockQuantity": 10,
    "size": "M",
    "category": {
        "categoryId": 999
    }
}
```

**Expected Response (HTTP 400 or 500):**
```json
{
    "error": "Category not found with ID: 999"
}
```

---

### TEST CASE 2.7: Get All Products
**Objective:** Validate product catalog retrieval
**Business Logic:** Returns complete product list with category information

**HTTP Method:** `GET`
**Endpoint:** `/api/products`
**Authorization:** None required (public endpoint)

**Expected Response (HTTP 200):**
```json
[
    {
        "productId": 1,
        "name": "iPhone 15 Pro Max",
        "description": "Latest iPhone with A17 Pro chip, titanium design, and advanced camera system",
        "price": 1199.99,
        "stockQuantity": 50,
        "size": "L",
        "imageUrl": "https://example.com/images/iphone15promax.jpg"
    },
    {
        "productId": 2,
        "name": "Premium Cotton T-Shirt",
        "description": "100% organic cotton t-shirt with comfortable fit",
        "price": 29.99,
        "stockQuantity": 100,
        "size": "M",
        "imageUrl": "https://example.com/images/cotton-tshirt.jpg"
    }
]
```

**Business Logic Notes:**
- **Category Information:** May be excluded due to @JsonIgnore annotation
- **Product Availability:** All products shown regardless of stock status

---

### TEST CASE 2.8: Get Product by ID
**Objective:** Validate single product retrieval
**Prerequisites:** Valid productId from previous tests

**HTTP Method:** `GET`
**Endpoint:** `/api/products/1`
**Authorization:** None required

**Expected Response (HTTP 200):**
```json
{
    "productId": 1,
    "name": "iPhone 15 Pro Max",
    "description": "Latest iPhone with A17 Pro chip, titanium design, and advanced camera system",
    "price": 1199.99,
    "stockQuantity": 50,
    "size": "L",
    "imageUrl": "https://example.com/images/iphone15promax.jpg"
}
```

---

### TEST CASE 2.9: Search Products by Name
**Objective:** Validate product search functionality
**Business Logic:** Case-insensitive partial name matching

**HTTP Method:** `GET`
**Endpoint:** `/api/products/search/iPhone`
**Authorization:** None required

**Expected Response (HTTP 200):**
```json
[
    {
        "productId": 1,
        "name": "iPhone 15 Pro Max",
        "description": "Latest iPhone with A17 Pro chip, titanium design, and advanced camera system",
        "price": 1199.99,
        "stockQuantity": 50,
        "size": "L",
        "imageUrl": "https://example.com/images/iphone15promax.jpg"
    }
]
```

---

### TEST CASE 2.10: Filter Products by Category
**Objective:** Validate category-based product filtering
**Prerequisites:** Valid categoryId and associated products

**HTTP Method:** `GET`
**Endpoint:** `/api/products/category/1`
**Authorization:** None required

**Expected Response (HTTP 200):**
```json
[
    {
        "productId": 1,
        "name": "iPhone 15 Pro Max",
        "description": "Latest iPhone with A17 Pro chip, titanium design, and advanced camera system",
        "price": 1199.99,
        "stockQuantity": 50,
        "size": "L",
        "imageUrl": "https://example.com/images/iphone15promax.jpg"
    }
]
```

---

### TEST CASE 2.11: Advanced Product Filtering
**Objective:** Validate multi-criteria product filtering
**Business Logic:** Combines multiple filter parameters using AND logic

**HTTP Method:** `GET`
**Endpoint:** `/api/products/filter?categoryId=1&minPrice=1000&maxPrice=1500&size=L&inStock=true`
**Authorization:** None required

**Query Parameters:**
- categoryId: 1 (Electronics)
- minPrice: 1000.00
- maxPrice: 1500.00
- size: L
- inStock: true

**Expected Response (HTTP 200):**
```json
[
    {
        "productId": 1,
        "name": "iPhone 15 Pro Max",
        "description": "Latest iPhone with A17 Pro chip, titanium design, and advanced camera system",
        "price": 1199.99,
        "stockQuantity": 50,
        "size": "L",
        "imageUrl": "https://example.com/images/iphone15promax.jpg"
    }
]
```

**Filter Logic:**
- **Price Range:** minPrice ≤ product.price ≤ maxPrice
- **Stock Status:** inStock=true filters products with stockQuantity > 0
- **Size Match:** Exact enum value matching
- **Category Filter:** Foreign key relationship filtering

---

## Phase 3: Address Management

### TEST CASE 3.1: Create Shipping Address
**Objective:** Add shipping address for order processing
**Business Logic:** Associates address with user account for order delivery
**Prerequisites:** Valid userId from TEST CASE 1.1

**HTTP Method:** `POST`
**Endpoint:** `/api/addresses/user/1`
**Authorization:** Session-based (authenticated user required)

**Request Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
    "street": "123 Technology Boulevard",
    "city": "San Francisco",
    "state": "California",
    "postalCode": "94105",
    "country": "United States",
    "addressType": "SHIPPING",
    "isDefault": true
}
```

**Expected Response (HTTP 200):**
```json
{
    "addressId": 1,
    "street": "123 Technology Boulevard",
    "city": "San Francisco",
    "state": "California",
    "postalCode": "94105",
    "country": "United States",
    "addressType": "SHIPPING",
    "isDefault": true
}
```

**Critical Test Data:**
- **Save addressId:** `1` (Required for order processing)
- **Address Type:** SHIPPING/BILLING enum values
- **Default Flag:** Only one default address per user allowed

**Data Validation Rules:**
- Street: Required for complete address
- City: Required for delivery
- PostalCode: Required for shipping calculations
- Country: Required for international handling
- AddressType: Enum constraint (SHIPPING, BILLING)

**Business Constraints:**
- **User Association:** Address linked to specific userId
- **Default Management:** Setting isDefault=true should unset other default addresses

---

### TEST CASE 3.2: Create Billing Address
**Objective:** Add billing address for payment processing
**Prerequisites:** Same userId from TEST CASE 1.1

**HTTP Method:** `POST`
**Endpoint:** `/api/addresses/user/1`

**Request Body:**
```json
{
    "street": "456 Financial District",
    "city": "New York",
    "state": "New York",
    "postalCode": "10004",
    "country": "United States",
    "addressType": "BILLING",
    "isDefault": false
}
```

**Expected Response (HTTP 200):**
```json
{
    "addressId": 2,
    "street": "456 Financial District",
    "city": "New York",
    "state": "New York",
    "postalCode": "10004",
    "country": "United States",
    "addressType": "BILLING",
    "isDefault": false
}
```

**Save addressId:** `2`

---

### TEST CASE 3.3: Get User Addresses
**Objective:** Validate address retrieval for specific user
**Business Logic:** Returns all addresses associated with userId
**Prerequisites:** Valid userId and created addresses

**HTTP Method:** `GET`
**Endpoint:** `/api/addresses/user/1`
**Authorization:** Session-based (user can only access own addresses)

**Expected Response (HTTP 200):**
```json
[
    {
        "addressId": 1,
        "street": "123 Technology Boulevard",
        "city": "San Francisco",
        "state": "California",
        "postalCode": "94105",
        "country": "United States",
        "addressType": "SHIPPING",
        "isDefault": true
    },
    {
        "addressId": 2,
        "street": "456 Financial District",
        "city": "New York",
        "state": "New York",
        "postalCode": "10004",
        "country": "United States",
        "addressType": "BILLING",
        "isDefault": false
    }
]
```

**Security Validation:**
- **Authorization:** User can only retrieve their own addresses
- **Data Privacy:** Other users' addresses should not be accessible

---

### TEST CASE 3.4: Get Default Address
**Objective:** Validate default address retrieval functionality
**Business Logic:** Returns user's primary address for quick selection

**HTTP Method:** `GET`
**Endpoint:** `/api/addresses/user/1/default`
**Authorization:** Session-based

**Expected Response (HTTP 200):**
```json
{
    "addressId": 1,
    "street": "123 Technology Boulevard",
    "city": "San Francisco",
    "state": "California",
    "postalCode": "94105",
    "country": "United States",
    "addressType": "SHIPPING",
    "isDefault": true
}
```

---

### TEST CASE 3.5: Get Addresses by Type
**Objective:** Validate address filtering by type
**Business Logic:** Returns addresses matching specific type (SHIPPING/BILLING)

**HTTP Method:** `GET`
**Endpoint:** `/api/addresses/user/1/type/SHIPPING`
**Authorization:** Session-based

**Expected Response (HTTP 200):**
```json
[
    {
        "addressId": 1,
        "street": "123 Technology Boulevard",
        "city": "San Francisco",
        "state": "California",
        "postalCode": "94105",
        "country": "United States",
        "addressType": "SHIPPING",
        "isDefault": true
    }
]
```

---

## Phase 4: Shopping Cart Operations

### TEST CASE 4.1: Add Product to Cart
**Objective:** Add product to user's shopping cart
**Business Logic:** Creates cart item with user-product association and quantity tracking
**Prerequisites:** Valid userId (1) and productId (1) from previous tests

**HTTP Method:** `POST`
**Endpoint:** `/api/cart`
**Authorization:** Session-based (authenticated user required)

**Request Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
    "user": {
        "userId": 1
    },
    "product": {
        "productId": 1
    },
    "quantity": 2
}
```

**Expected Response (HTTP 200):**
```json
{
    "cartId": 1,
    "quantity": 2,
    "user": {
        "userId": 1,
        "username": "testuser001",
        "email": "testuser001@example.com"
    },
    "product": {
        "productId": 1,
        "name": "iPhone 15 Pro Max",
        "price": 1199.99,
        "stockQuantity": 50
    }
}
```

**Critical Test Data:**
- **Save cartId:** `1` (Required for cart operations)
- **Quantity Validation:** Must be positive integer
- **Stock Check:** System should validate quantity ≤ stockQuantity

**Business Constraints:**
- **User Association:** Cart items linked to specific user
- **Product Availability:** Cannot add out-of-stock products
- **Duplicate Prevention:** Adding same product should update quantity, not create duplicate

---

### TEST CASE 4.2: Add Second Product to Cart
**Objective:** Add different product to demonstrate multi-item cart
**Prerequisites:** Valid userId (1) and productId (2)

**HTTP Method:** `POST`
**Endpoint:** `/api/cart`

**Request Body:**
```json
{
    "user": {
        "userId": 1
    },
    "product": {
        "productId": 2
    },
    "quantity": 3
}
```

**Expected Response (HTTP 200):**
```json
{
    "cartId": 2,
    "quantity": 3,
    "user": {
        "userId": 1
    },
    "product": {
        "productId": 2,
        "name": "Premium Cotton T-Shirt",
        "price": 29.99,
        "stockQuantity": 100
    }
}
```

**Save cartId:** `2`

---

### TEST CASE 4.3: Get User Cart Items
**Objective:** Retrieve all cart items for specific user
**Business Logic:** Returns complete cart with product details and total calculations
**Prerequisites:** Valid userId and existing cart items

**HTTP Method:** `GET`
**Endpoint:** `/api/cart/user/1`
**Authorization:** Session-based (user can only access own cart)

**Expected Response (HTTP 200):**
```json
[
    {
        "cartId": 1,
        "quantity": 2,
        "user": {
            "userId": 1
        },
        "product": {
            "productId": 1,
            "name": "iPhone 15 Pro Max",
            "price": 1199.99,
            "stockQuantity": 50
        }
    },
    {
        "cartId": 2,
        "quantity": 3,
        "user": {
            "userId": 1
        },
        "product": {
            "productId": 2,
            "name": "Premium Cotton T-Shirt",
            "price": 29.99,
            "stockQuantity": 100
        }
    }
]
```

**Cart Total Calculation:**
- Item 1: 2 × $1199.99 = $2399.98
- Item 2: 3 × $29.99 = $89.97
- **Total: $2489.95**

---

### TEST CASE 4.4: Update Cart Item Quantity
**Objective:** Modify quantity of existing cart item
**Business Logic:** Updates quantity and recalculates cart totals
**Prerequisites:** Valid cartId from previous tests

**HTTP Method:** `PUT`
**Endpoint:** `/api/cart/1?quantity=4`
**Authorization:** Session-based

**Query Parameters:**
- quantity: 4 (new quantity value)

**Expected Response (HTTP 200):**
```json
{
    "cartId": 1,
    "quantity": 4,
    "user": {
        "userId": 1
    },
    "product": {
        "productId": 1,
        "name": "iPhone 15 Pro Max",
        "price": 1199.99,
        "stockQuantity": 50
    }
}
```

**Updated Cart Total:**
- Item 1: 4 × $1199.99 = $4799.96
- Item 2: 3 × $29.99 = $89.97
- **New Total: $4889.93**

**Validation Rules:**
- **Quantity Range:** Must be positive integer
- **Stock Validation:** quantity ≤ product.stockQuantity
- **Zero Quantity:** Should remove item from cart

---

### TEST CASE 4.5: Cart Item Quantity (Negative Flow - Exceeds Stock)
**Objective:** Validate stock quantity constraints
**Business Logic:** System should reject quantity exceeding available stock

**HTTP Method:** `PUT`
**Endpoint:** `/api/cart/1?quantity=100`

**Expected Response (HTTP 400):**
```json
{
    "error": "Requested quantity exceeds available stock",
    "availableStock": 50,
    "requestedQuantity": 100
}
```

---

### TEST CASE 4.6: Remove Item from Cart
**Objective:** Delete specific cart item
**Business Logic:** Removes item and updates cart totals
**Prerequisites:** Valid cartId

**HTTP Method:** `DELETE`
**Endpoint:** `/api/cart/2`
**Authorization:** Session-based

**Expected Response (HTTP 204 No Content):**
*(Empty response body)*

**Post-Deletion Cart State:**
- Only cartId 1 should remain
- Cart total: 4 × $1199.99 = $4799.96

---

### Phase 5: Order Creation and Management

#### 5.1 Create Order
**Purpose:** Place an order with cart items

**Endpoint:** `POST /api/orders`

**Request Body:**
```json
{
    "userId": 1,
    "customerName": "Test User",
    "email": "testuser@example.com",
    "phone": "+1234567890",
    "shippingAddress": "123 Main Street, New York, NY 10001",
    "billingAddress": "123 Main Street, New York, NY 10001",
    "paymentMethod": "card",
    "cartItems": [
        {
            "productId": 1,
            "quantity": 2,
            "price": 999.99
        },
        {
            "productId": 2,
            "quantity": 1,
            "price": 899.99
        }
    ]
}
```

**Expected Response (200 OK):**
```json
{
    "orderId": 1,
    "status": "PENDING",
    "totalAmount": 2899.97,
    "orderDate": "2024-01-15T10:30:00",
    "orderItems": [
        {
            "orderDetailId": 1,
            "productId": 1,
            "name": "iPhone 15",
            "quantity": 2,
            "price": 999.99
        },
        {
            "orderDetailId": 2,
            "productId": 2,
            "name": "Samsung Galaxy S24",
            "quantity": 1,
            "price": 899.99
        }
    ]
}
```

**Save for later:** Note the `orderId` and `totalAmount`.

---

#### 5.2 Get Order Details
**Purpose:** Retrieve specific order information

**Endpoint:** `GET /api/orders/1`

**Expected Response:** Complete order details with items.

---

#### 5.3 Get Orders by User
**Purpose:** Get all orders for a specific user

**Endpoint:** `GET /api/orders/user/1`

**Expected Response:** Array of all orders for the user.

---

### Phase 6: Payment Processing

#### 6.1 Create Razorpay Order
**Purpose:** Generate payment order with Razorpay

**Endpoint:** `POST /api/payments/create-order?amount=2899.97`

**Expected Response (200 OK):**
```json
{
    "id": "order_razorpay_id_12345",
    "amount": 289997,
    "currency": "INR",
    "receipt": "order_1642234200000"
}
```

**Save for later:** Note the Razorpay `id` for payment processing.

---

#### 6.2 Create Payment Record
**Purpose:** Record payment details in the system

**Endpoint:** `POST /api/payments`

**Request Body:**
```json
{
    "order": {
        "orderId": 1
    },
    "amount": 2899.97,
    "paymentMethod": "card",
    "status": "PENDING",
    "transactionId": "pay_razorpay_payment_id_67890"
}
```

**Expected Response (200 OK):**
```json
{
    "paymentId": 1,
    "amount": 2899.97,
    "paymentMethod": "card",
    "status": "PENDING",
    "transactionId": "pay_razorpay_payment_id_67890",
    "paymentDate": "2024-01-15T10:35:00"
}
```

---

#### 6.3 Update Payment Status
**Purpose:** Mark payment as completed

**Endpoint:** `PUT /api/payments/1/status?status=COMPLETED`

**Expected Response:** Updated payment with COMPLETED status.

---

#### 6.4 Update Payment via Webhook
**Purpose:** Process Razorpay payment callback

**Endpoint:** `POST /api/payments/update`

**Request Body:**
```json
{
    "orderId": "1",
    "paymentId": "pay_razorpay_payment_id_67890",
    "razorpayOrderId": "order_razorpay_id_12345",
    "status": "COMPLETED",
    "amount": "2899.97"
}
```

**Expected Response (200 OK):**
```json
{
    "status": "success",
    "orderId": "1",
    "paymentId": "pay_razorpay_payment_id_67890",
    "message": "Payment updated successfully"
}
```

---

### Phase 7: Order Status Management

#### 7.1 Update Order Status to Processing
**Purpose:** Move order to processing state

**Endpoint:** `PUT /api/orders/1/status?status=PROCESSING`

**Expected Response:** Updated order with PROCESSING status.

---

#### 7.2 Update Order Status to Shipped
**Purpose:** Mark order as shipped

**Endpoint:** `PUT /api/orders/1/status?status=SHIPPED`

**Expected Response:** Updated order with SHIPPED status.

---

#### 7.3 Update Order Status to Delivered
**Purpose:** Complete the order lifecycle

**Endpoint:** `PUT /api/orders/1/status?status=DELIVERED`

**Expected Response:** Updated order with DELIVERED status.

---

### Phase 8: Additional Features

#### 8.1 Add to Wishlist
**Purpose:** Save products for later

**Endpoint:** `POST /api/wishlist`

**Request Body:**
```json
{
    "user": {
        "userId": 1
    },
    "product": {
        "productId": 1
    }
}
```

**Expected Response (200 OK):**
```json
{
    "wishlistId": 1,
    "user": {
        "userId": 1
    },
    "product": {
        "productId": 1,
        "name": "iPhone 15"
    }
}
```

---

#### 8.2 Get Wishlist Items
**Purpose:** Retrieve user's wishlist

**Endpoint:** `GET /api/wishlist/user/1`

**Expected Response:** Array of wishlist items.

---

#### 8.3 Add Product Review
**Purpose:** Add product review after purchase

**Endpoint:** `POST /api/reviews`

**Request Body:**
```json
{
    "user": {
        "userId": 1
    },
    "product": {
        "productId": 1
    },
    "rating": 5,
    "comment": "Excellent product! Highly recommended."
}
```

**Expected Response (200 OK):**
```json
{
    "reviewId": 1,
    "rating": 5,
    "comment": "Excellent product! Highly recommended.",
    "reviewDate": "2024-01-15T11:00:00"
}
```

---

#### 8.4 Chat with AI Assistant
**Purpose:** Get customer support via AI chatbot

**Endpoint:** `POST /api/chat`

**Request Body:**
```json
{
    "message": "I need help with my order status"
}
```

**Expected Response (200 OK):**
```json
{
    "response": "I'd be happy to help you check your order status. Please provide your order ID."
}
```

---

### Phase 9: Administrative Operations

#### 9.1 Get All Orders (Admin)
**Purpose:** Admin view of all orders

**Endpoint:** `GET /api/orders`

**Expected Response:** Array of all orders in the system.

---

#### 9.2 Get Orders by Status
**Purpose:** Filter orders by status

**Endpoint:** `GET /api/orders/status/PENDING`

**Expected Response:** Array of orders with PENDING status.

---

#### 9.3 Get All Users (Admin)
**Purpose:** Admin view of all users

**Endpoint:** `GET /api/users`

**Expected Response:** Array of all registered users.

---

#### 9.4 Product Search and Filtering
**Purpose:** Search products by various criteria

**Search by Name:**
`GET /api/products/search/iPhone`

**Filter by Category:**
`GET /api/products/category/1`

**Advanced Filtering:**
`GET /api/products/filter?categoryId=1&minPrice=500&maxPrice=1500&size=M&inStock=true`

---

### Phase 10: Email Testing

#### 10.1 Test Email Service
**Purpose:** Verify email functionality

**Endpoint:** `GET /api/payments/test-email`

**Expected Response:** "Email sent!" message and email delivery to configured address.

---

## Testing Scenarios Summary

### Successful E-Commerce Flow:
1. ✅ User Registration → Login
2. ✅ Category Creation → Product Creation
3. ✅ Address Addition
4. ✅ Add Products to Cart → Update Quantities
5. ✅ Create Order → Payment Processing
6. ✅ Order Status Updates (Pending → Processing → Shipped → Delivered)
7. ✅ Add Reviews → Wishlist Management
8. ✅ AI Chat Support

### Error Testing Scenarios:
- **Invalid Registration:** Try registering with existing email/username
- **Invalid Login:** Wrong credentials
- **Insufficient Stock:** Order more than available stock
- **Invalid Order:** Missing required fields
- **Payment Failures:** Invalid payment data
- **Unauthorized Access:** Access other user's data

---

## Common Response Codes

- **200 OK:** Successful operation
- **201 Created:** Resource created successfully
- **400 Bad Request:** Invalid input data
- **401 Unauthorized:** Authentication required
- **404 Not Found:** Resource not found
- **409 Conflict:** Resource already exists (e.g., duplicate wishlist item)
- **500 Internal Server Error:** Server-side error

---

## Important Notes

1. **Data Persistence:** All operations persist data to MySQL database
2. **CORS:** Frontend must be served from `http://localhost:5173`
3. **Email Configuration:** Configure SMTP settings for email functionality
4. **Razorpay Setup:** Configure Razorpay API keys in `application.properties`
5. **Database Migration:** Flyway handles schema updates automatically
6. **Logging:** Debug logs available for troubleshooting

---

## Conclusion

This comprehensive testing guide covers the complete e-commerce workflow from user registration to order completion. Each API endpoint is tested with realistic data and proper error handling. The flow demonstrates the full functionality of the Athena E-Commerce Backend system.

For production deployment, ensure proper security configurations, environment variables for sensitive data, and performance optimizations are in place.