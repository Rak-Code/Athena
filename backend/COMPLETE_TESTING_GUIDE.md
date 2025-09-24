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

## Phase 5: Order Creation and Management

### TEST CASE 5.1: Create Order from Cart
**Objective:** Convert cart items into formal order with complete customer information
**Business Logic:** Creates order record, order details, and updates inventory
**Prerequisites:** Valid userId, cart items, and address information

**HTTP Method:** `POST`
**Endpoint:** `/api/orders`
**Authorization:** Session-based (authenticated user required)

**Request Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
    "userId": 1,
    "customerName": "Test User",
    "email": "testuser001@example.com",
    "phone": "+1-555-123-4567",
    "shippingAddress": "123 Technology Boulevard, San Francisco, CA 94105",
    "billingAddress": "456 Financial District, New York, NY 10004",
    "paymentMethod": "card",
    "cartItems": [
        {
            "productId": 1,
            "quantity": 4,
            "price": 1199.99
        },
        {
            "productId": 2,
            "quantity": 3,
            "price": 29.99
        }
    ]
}
```

**Expected Response (HTTP 200):**
```json
{
    "orderId": 1,
    "status": "PENDING",
    "totalAmount": 4889.93,
    "orderDate": "2024-01-15T10:30:00",
    "orderItems": [
        {
            "orderDetailId": 1,
            "productId": 1,
            "name": "iPhone 15 Pro Max",
            "quantity": 4,
            "price": 1199.99
        },
        {
            "orderDetailId": 2,
            "productId": 2,
            "name": "Premium Cotton T-Shirt",
            "quantity": 3,
            "price": 29.99
        }
    ]
}
```

**Critical Test Data:**
- **Save orderId:** `1` (Required for payment, status updates, order tracking)
- **Save orderDetailIds:** `1, 2` (Required for individual item operations)
- **Total Calculation:** (4 × $1199.99) + (3 × $29.99) = $4889.93

**Business Logic Validations:**
- **Stock Deduction:** Product stockQuantity should decrease by ordered amounts
- **Order Status:** Initializes to PENDING status
- **Customer Data:** All contact information validated and stored
- **Address Validation:** Complete shipping address required

**Data Integrity Constraints:**
- **User Association:** Order linked to authenticated user
- **Product Validation:** All productIds must exist and be available
- **Price Consistency:** Prices should match current product prices
- **Quantity Validation:** Cannot exceed available stock

**Required Field Validations:**
- customerName: Required, non-empty
- email: Required, valid email format
- phone: Required, valid phone format
- shippingAddress: Required, complete address
- cartItems: Required, non-empty array

---

### TEST CASE 5.2: Get Order by ID
**Objective:** Retrieve complete order information including items and customer details
**Business Logic:** Returns order with related data (customer, items, payments)
**Prerequisites:** Valid orderId from TEST CASE 5.1

**HTTP Method:** `GET`
**Endpoint:** `/api/orders/1`
**Authorization:** Session-based (user can access own orders)

**Expected Response (HTTP 200):**
```json
{
    "orderId": 1,
    "user": {
        "userId": 1,
        "username": "testuser001",
        "email": "testuser001@example.com"
    },
    "customerName": "Test User",
    "email": "testuser001@example.com",
    "phone": "+1-555-123-4567",
    "totalAmount": 4889.93,
    "status": "PENDING",
    "orderDate": "2024-01-15T10:30:00",
    "shippingAddress": "123 Technology Boulevard, San Francisco, CA 94105",
    "billingAddress": "456 Financial District, New York, NY 10004",
    "paymentMethod": "card",
    "orderDetails": [
        {
            "orderDetailId": 1,
            "product": {
                "productId": 1,
                "name": "iPhone 15 Pro Max",
                "price": 1199.99
            },
            "quantity": 4,
            "price": 1199.99
        },
        {
            "orderDetailId": 2,
            "product": {
                "productId": 2,
                "name": "Premium Cotton T-Shirt",
                "price": 29.99
            },
            "quantity": 3,
            "price": 29.99
        }
    ]
}
```

**Security Validation:**
- **Authorization:** User can only access their own orders
- **Data Privacy:** Other users' orders should return 404 or 403

---

### TEST CASE 5.3: Get Orders by User ID
**Objective:** Retrieve all orders for specific user (order history)
**Business Logic:** Returns user's complete order history with summary information
**Prerequisites:** Valid userId and existing orders

**HTTP Method:** `GET`
**Endpoint:** `/api/orders/user/1`
**Authorization:** Session-based (user accessing own order history)

**Expected Response (HTTP 200):**
```json
[
    {
        "orderId": 1,
        "customerName": "Test User",
        "totalAmount": 4889.93,
        "status": "PENDING",
        "orderDate": "2024-01-15T10:30:00",
        "paymentMethod": "card"
    }
]
```

---

### TEST CASE 5.4: Get All Orders (Admin Function)
**Objective:** Administrative view of all orders in system
**Business Logic:** Returns all orders for management purposes
**Prerequisites:** Admin privileges (implementation may vary)

**HTTP Method:** `GET`
**Endpoint:** `/api/orders`
**Authorization:** Session-based (admin access required)

**Expected Response (HTTP 200):**
```json
[
    {
        "orderId": 1,
        "user": {
            "userId": 1,
            "username": "testuser001"
        },
        "customerName": "Test User",
        "totalAmount": 4889.93,
        "status": "PENDING",
        "orderDate": "2024-01-15T10:30:00",
        "paymentMethod": "card"
    }
]
```

**Administrative Features:**
- **Order Management:** View all customer orders
- **Status Monitoring:** Track order fulfillment pipeline
- **Revenue Tracking:** Monitor total order values

---

### TEST CASE 5.5: Order Creation (Negative Flow - Invalid Product)
**Objective:** Validate product existence during order creation
**Business Logic:** System should reject orders with non-existent products

**HTTP Method:** `POST`
**Endpoint:** `/api/orders`

**Request Body:**
```json
{
    "userId": 1,
    "customerName": "Test User",
    "email": "testuser001@example.com",
    "phone": "+1-555-123-4567",
    "shippingAddress": "123 Technology Boulevard, San Francisco, CA 94105",
    "paymentMethod": "card",
    "cartItems": [
        {
            "productId": 999,
            "quantity": 1,
            "price": 100.00
        }
    ]
}
```

**Expected Response (HTTP 400):**
```json
{
    "error": "Product not found with ID: 999"
}
```

---

### TEST CASE 5.6: Order Creation (Negative Flow - Insufficient Stock)
**Objective:** Validate stock availability during order creation
**Business Logic:** System should reject orders exceeding available inventory

**HTTP Method:** `POST`
**Endpoint:** `/api/orders`

**Request Body:**
```json
{
    "userId": 1,
    "customerName": "Test User",
    "email": "testuser001@example.com",
    "phone": "+1-555-123-4567",
    "shippingAddress": "123 Technology Boulevard, San Francisco, CA 94105",
    "paymentMethod": "card",
    "cartItems": [
        {
            "productId": 1,
            "quantity": 1000,
            "price": 1199.99
        }
    ]
}
```

**Expected Response (HTTP 400):**
```json
{
    "error": "Insufficient stock for product: iPhone 15 Pro Max",
    "availableStock": 46,
    "requestedQuantity": 1000
}
```

**Note:** Available stock should be 46 (50 - 4 from previous order)

---

## Phase 6: Order Status Management

### TEST CASE 6.1: Update Order Status to PROCESSING
**Objective:** Advance order through fulfillment pipeline
**Business Logic:** Changes order status from PENDING to PROCESSING
**Prerequisites:** Valid orderId in PENDING status

**HTTP Method:** `PUT`
**Endpoint:** `/api/orders/1/status?status=PROCESSING`
**Authorization:** Session-based (admin or order owner)

**Query Parameters:**
- status: PROCESSING (Order.Status enum value)

**Expected Response (HTTP 200):**
```json
{
    "orderId": 1,
    "status": "PROCESSING",
    "totalAmount": 4889.93,
    "orderDate": "2024-01-15T10:30:00",
    "statusUpdateDate": "2024-01-15T11:00:00",
    "customerName": "Test User"
}
```

**Status Transition Rules:**
- **Valid Transitions:** PENDING → PROCESSING → SHIPPED → DELIVERED
- **Invalid Transitions:** Cannot skip states or go backwards
- **Business Logic:** PROCESSING indicates order is being prepared

---

### TEST CASE 6.2: Update Order Status to SHIPPED
**Objective:** Mark order as shipped for delivery tracking
**Prerequisites:** Order in PROCESSING status

**HTTP Method:** `PUT`
**Endpoint:** `/api/orders/1/status?status=SHIPPED`
**Authorization:** Session-based

**Expected Response (HTTP 200):**
```json
{
    "orderId": 1,
    "status": "SHIPPED",
    "totalAmount": 4889.93,
    "orderDate": "2024-01-15T10:30:00",
    "statusUpdateDate": "2024-01-15T12:00:00",
    "customerName": "Test User"
}
```

**Business Integration:**
- **Shipping Notifications:** Email sent to customer
- **Tracking Information:** Shipping carrier data integration
- **Inventory Finalization:** Stock permanently reduced

---

### TEST CASE 6.3: Update Order Status to DELIVERED
**Objective:** Complete order fulfillment lifecycle
**Prerequisites:** Order in SHIPPED status

**HTTP Method:** `PUT`
**Endpoint:** `/api/orders/1/status?status=DELIVERED`
**Authorization:** Session-based

**Expected Response (HTTP 200):**
```json
{
    "orderId": 1,
    "status": "DELIVERED",
    "totalAmount": 4889.93,
    "orderDate": "2024-01-15T10:30:00",
    "deliveryDate": "2024-01-17T14:30:00",
    "customerName": "Test User"
}
```

**Order Completion:**
- **Final Status:** DELIVERED is terminal status
- **Customer Communication:** Delivery confirmation email
- **Review Eligibility:** Customer can now review products

---

### TEST CASE 6.4: Invalid Status Transition (Negative Flow)
**Objective:** Validate status transition business rules
**Business Logic:** System should reject invalid status changes

**HTTP Method:** `PUT`
**Endpoint:** `/api/orders/1/status?status=PENDING`

**Expected Response (HTTP 400):**
```json
{
    "error": "Invalid status transition from DELIVERED to PENDING"
}
```

---

### TEST CASE 6.5: Get Orders by Status
**Objective:** Filter orders by current status for management dashboard
**Business Logic:** Administrative function for order pipeline monitoring

**HTTP Method:** `GET`
**Endpoint:** `/api/orders/status/DELIVERED`
**Authorization:** Session-based (admin privileges)

**Expected Response (HTTP 200):**
```json
[
    {
        "orderId": 1,
        "customerName": "Test User",
        "totalAmount": 4889.93,
        "status": "DELIVERED",
        "orderDate": "2024-01-15T10:30:00",
        "deliveryDate": "2024-01-17T14:30:00"
    }
]
```

**Status Filter Options:**
- PENDING: New orders awaiting processing
- PROCESSING: Orders being prepared
- SHIPPED: Orders in transit
- DELIVERED: Completed orders
- CANCELLED: Cancelled orders

---

## Phase 7: Payment Processing

### TEST CASE 7.1: Create Razorpay Payment Order
**Objective:** Generate Razorpay order for payment gateway integration
**Business Logic:** Creates payment order with amount in paise (1 INR = 100 paise)
**Prerequisites:** Valid order total amount and Razorpay API configuration

**HTTP Method:** `POST`
**Endpoint:** `/api/payments/create-order?amount=4889.93`
**Authorization:** Session-based (authenticated user required)

**Query Parameters:**
- amount: 4889.93 (Amount in INR, will be converted to paise)

**Expected Response (HTTP 200):**
```json
{
    "id": "order_razorpay_order_12345",
    "amount": 488993,
    "currency": "INR",
    "receipt": "order_1642234200000"
}
```

**Critical Test Data:**
- **Save Razorpay Order ID:** `order_razorpay_order_12345`
- **Amount Conversion:** $4889.93 → 488993 paise
- **Receipt Generation:** Unique timestamp-based receipt

**Integration Requirements:**
- **Razorpay Configuration:** API keys must be configured in application.properties
- **Currency:** Fixed to INR for Indian payment processing
- **Amount Validation:** Must match order total amount

**Error Scenarios:**
- Missing Razorpay API keys → HTTP 400
- Invalid amount format → HTTP 400
- Razorpay service unavailable → HTTP 500

---

### TEST CASE 7.2: Create Payment Record
**Objective:** Record payment details in system database
**Business Logic:** Links payment to order and tracks transaction status
**Prerequisites:** Valid orderId and payment gateway response

**HTTP Method:** `POST`
**Endpoint:** `/api/payments`
**Authorization:** Session-based

**Request Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
    "order": {
        "orderId": 1
    },
    "amount": 4889.93,
    "paymentMethod": "card",
    "status": "PENDING",
    "transactionId": "pay_razorpay_payment_67890"
}
```

**Expected Response (HTTP 200):**
```json
{
    "paymentId": 1,
    "order": {
        "orderId": 1
    },
    "amount": 4889.93,
    "paymentMethod": "card",
    "status": "PENDING",
    "transactionId": "pay_razorpay_payment_67890",
    "paymentDate": "2024-01-15T11:00:00"
}
```

**Critical Test Data:**
- **Save paymentId:** `1` (Required for payment updates)
- **Transaction Tracking:** Links to Razorpay transaction ID
- **Email Notification:** System sends payment confirmation email

**Payment Method Options:**
- card: Credit/Debit card payments
- netbanking: Internet banking
- upi: UPI payments
- wallet: Digital wallet payments
- cod: Cash on delivery

**Status Lifecycle:**
- PENDING: Payment initiated
- PROCESSING: Payment being processed
- COMPLETED: Payment successful
- FAILED: Payment failed
- REFUNDED: Payment refunded

---

### TEST CASE 7.3: Update Payment Status to COMPLETED
**Objective:** Mark payment as successfully completed
**Business Logic:** Updates payment status and triggers order processing
**Prerequisites:** Valid paymentId in PENDING status

**HTTP Method:** `PUT`
**Endpoint:** `/api/payments/1/status?status=COMPLETED`
**Authorization:** Session-based

**Query Parameters:**
- status: COMPLETED (Payment.Status enum value)

**Expected Response (HTTP 200):**
```json
{
    "paymentId": 1,
    "order": {
        "orderId": 1
    },
    "amount": 4889.93,
    "paymentMethod": "card",
    "status": "COMPLETED",
    "transactionId": "pay_razorpay_payment_67890",
    "paymentDate": "2024-01-15T11:00:00",
    "completionDate": "2024-01-15T11:05:00"
}
```

**Business Integration:**
- **Email Notification:** Payment success email sent to customer
- **Order Status:** May trigger order status update to PROCESSING
- **Inventory Management:** Confirms product allocation

---

### TEST CASE 7.4: Razorpay Webhook Payment Update
**Objective:** Process payment callback from Razorpay gateway
**Business Logic:** Updates payment status based on gateway response
**Prerequisites:** Valid order and payment IDs

**HTTP Method:** `POST`
**Endpoint:** `/api/payments/update`
**Authorization:** Webhook (may use different authentication)

**Request Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
    "orderId": "1",
    "paymentId": "pay_razorpay_payment_67890",
    "razorpayOrderId": "order_razorpay_order_12345",
    "status": "COMPLETED",
    "amount": "4889.93"
}
```

**Expected Response (HTTP 200):**
```json
{
    "status": "success",
    "orderId": "1",
    "paymentId": "pay_razorpay_payment_67890",
    "message": "Payment updated successfully"
}
```

**Webhook Security:**
- **Signature Verification:** Validate Razorpay webhook signature
- **Idempotency:** Handle duplicate webhook calls
- **Error Handling:** Graceful failure for invalid webhooks

---

### TEST CASE 7.5: Get Payment by Order ID
**Objective:** Retrieve payment information for specific order
**Business Logic:** Links payment data to order for customer reference
**Prerequisites:** Valid orderId with associated payments

**HTTP Method:** `GET`
**Endpoint:** `/api/payments/order/1`
**Authorization:** Session-based (user can access own order payments)

**Expected Response (HTTP 200):**
```json
[
    {
        "paymentId": 1,
        "amount": 4889.93,
        "paymentMethod": "card",
        "status": "COMPLETED",
        "transactionId": "pay_razorpay_payment_67890",
        "paymentDate": "2024-01-15T11:00:00",
        "completionDate": "2024-01-15T11:05:00"
    }
]
```

---

### TEST CASE 7.6: Get Payments by Status
**Objective:** Administrative view of payments by status
**Business Logic:** Monitor payment pipeline for financial reconciliation
**Prerequisites:** Admin privileges

**HTTP Method:** `GET`
**Endpoint:** `/api/payments/status/COMPLETED`
**Authorization:** Session-based (admin access)

**Expected Response (HTTP 200):**
```json
[
    {
        "paymentId": 1,
        "order": {
            "orderId": 1,
            "customerName": "Test User"
        },
        "amount": 4889.93,
        "paymentMethod": "card",
        "status": "COMPLETED",
        "transactionId": "pay_razorpay_payment_67890",
        "completionDate": "2024-01-15T11:05:00"
    }
]
```

---

### TEST CASE 7.7: Payment Failure Scenario (Negative Flow)
**Objective:** Handle payment failure gracefully
**Business Logic:** Update payment status and maintain order state

**HTTP Method:** `PUT`
**Endpoint:** `/api/payments/1/status?status=FAILED`

**Expected Response (HTTP 200):**
```json
{
    "paymentId": 1,
    "status": "FAILED",
    "failureReason": "Insufficient funds",
    "amount": 4889.93,
    "paymentDate": "2024-01-15T11:00:00"
}
```

**Failure Handling:**
- **Order Status:** May revert to PENDING for retry
- **Inventory:** Release reserved stock
- **Customer Notification:** Payment failure email
- **Retry Logic:** Allow customer to retry payment

---

## Phase 8: Wishlist Management

### TEST CASE 8.1: Add Product to Wishlist
**Objective:** Save product for future purchase consideration
**Business Logic:** Creates wishlist entry with user-product association
**Prerequisites:** Valid userId and productId (delivered order products recommended)

**HTTP Method:** `POST`
**Endpoint:** `/api/wishlist`
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
        "productId": 2
    }
}
```

**Expected Response (HTTP 200):**
```json
{
    "wishlistId": 1,
    "user": {
        "userId": 1,
        "username": "testuser001",
        "email": "testuser001@example.com"
    },
    "product": {
        "productId": 2,
        "name": "Premium Cotton T-Shirt",
        "price": 29.99,
        "imageUrl": "https://example.com/images/cotton-tshirt.jpg"
    }
}
```

**Critical Test Data:**
- **Save wishlistId:** `1` (Required for wishlist operations)
- **Duplicate Prevention:** Adding same product should return 409 Conflict

**Business Logic Validations:**
- **User Validation:** userId must exist and be authenticated
- **Product Validation:** productId must exist and be active
- **Uniqueness:** One product per user in wishlist (no duplicates)

---

### TEST CASE 8.2: Add Duplicate Product to Wishlist (Negative Flow)
**Objective:** Validate duplicate prevention logic
**Business Logic:** System should reject duplicate wishlist entries

**HTTP Method:** `POST`
**Endpoint:** `/api/wishlist`

**Request Body:**
```json
{
    "user": {
        "userId": 1
    },
    "product": {
        "productId": 2
    }
}
```

**Expected Response (HTTP 409):**
```json
{
    "message": "Product is already in the wishlist!"
}
```

---

### TEST CASE 8.3: Get User Wishlist Items
**Objective:** Retrieve all wishlist items for specific user
**Business Logic:** Returns user's saved products with current pricing
**Prerequisites:** Valid userId and existing wishlist items

**HTTP Method:** `GET`
**Endpoint:** `/api/wishlist/user/1`
**Authorization:** Session-based (user can only access own wishlist)

**Expected Response (HTTP 200):**
```json
[
    {
        "wishlistId": 1,
        "user": {
            "userId": 1
        },
        "product": {
            "productId": 2,
            "name": "Premium Cotton T-Shirt",
            "price": 29.99,
            "stockQuantity": 97,
            "imageUrl": "https://example.com/images/cotton-tshirt.jpg"
        }
    }
]
```

**Business Features:**
- **Current Pricing:** Shows latest product prices
- **Stock Status:** Indicates availability
- **Quick Add to Cart:** Easy conversion to purchase

---

### TEST CASE 8.4: Remove Product from Wishlist
**Objective:** Delete product from user's wishlist
**Business Logic:** Removes wishlist entry and updates user interface
**Prerequisites:** Valid wishlistId

**HTTP Method:** `DELETE`
**Endpoint:** `/api/wishlist/1`
**Authorization:** Session-based (user can only remove own wishlist items)

**Expected Response (HTTP 200):**
```json
{
    "message": "Wishlist item removed successfully"
}
```

---

### TEST CASE 8.5: Remove Product by User and Product ID
**Objective:** Alternative removal method using user and product IDs
**Business Logic:** Finds and removes wishlist item by relationship IDs

**HTTP Method:** `DELETE`
**Endpoint:** `/api/wishlist/user/1/product/2`
**Authorization:** Session-based

**Expected Response (HTTP 200):**
```json
{
    "message": "Wishlist item removed successfully"
}
```

**Alternative Use Cases:**
- **Product Discontinuation:** Remove unavailable products
- **Bulk Operations:** Remove multiple items efficiently

---

### TEST CASE 8.6: Invalid Wishlist Operations (Negative Flows)
**Objective:** Validate error handling for invalid operations

**Sub-test 8.6a: Missing User Information**
**HTTP Method:** `POST`
**Endpoint:** `/api/wishlist`

**Request Body:**
```json
{
    "product": {
        "productId": 1
    }
}
```

**Expected Response (HTTP 400):**
```json
{
    "message": "User information is missing or invalid"
}
```

**Sub-test 8.6b: Missing Product Information**
**Request Body:**
```json
{
    "user": {
        "userId": 1
    }
}
```

**Expected Response (HTTP 400):**
```json
{
    "message": "Product information is missing or invalid"
}
```

## Phase 9: Product Reviews

### TEST CASE 9.1: Add Product Review
**Objective:** Create product review after purchase and delivery
**Business Logic:** Allows customers to rate and review delivered products
**Prerequisites:** Valid userId, productId, and completed order (DELIVERED status)

**HTTP Method:** `POST`
**Endpoint:** `/api/reviews`
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
    "rating": 5,
    "comment": "Excellent product! The iPhone 15 Pro Max exceeded my expectations. Great camera quality and performance."
}
```

**Expected Response (HTTP 200):**
```json
{
    "reviewId": 1,
    "user": {
        "userId": 1,
        "username": "testuser001"
    },
    "product": {
        "productId": 1,
        "name": "iPhone 15 Pro Max"
    },
    "rating": 5,
    "comment": "Excellent product! The iPhone 15 Pro Max exceeded my expectations. Great camera quality and performance.",
    "reviewDate": "2024-01-18T09:00:00"
}
```

**Critical Test Data:**
- **Save reviewId:** `1` (Required for review operations)
- **Rating Range:** 1-5 integer values only
- **Purchase Verification:** User must have purchased the product

**Business Logic Validations:**
- **Rating Constraints:** Must be integer between 1 and 5
- **Purchase Requirement:** User must have delivered order containing product
- **Single Review:** One review per user per product (business rule)
- **Content Moderation:** Comment length and content validation

**Data Validation Rules:**
- Rating: Required, integer, range 1-5
- Comment: Optional, TEXT type, max length validation
- User: Required, must be authenticated
- Product: Required, must exist and be purchasable

---

### TEST CASE 9.2: Add Second Product Review
**Objective:** Create review for different product
**Prerequisites:** Different productId from delivered order

**HTTP Method:** `POST`
**Endpoint:** `/api/reviews`

**Request Body:**
```json
{
    "user": {
        "userId": 1
    },
    "product": {
        "productId": 2
    },
    "rating": 4,
    "comment": "Good quality t-shirt. Comfortable fabric and nice fit. Delivery was prompt."
}
```

**Expected Response (HTTP 200):**
```json
{
    "reviewId": 2,
    "rating": 4,
    "comment": "Good quality t-shirt. Comfortable fabric and nice fit. Delivery was prompt.",
    "reviewDate": "2024-01-18T09:15:00"
}
```

**Save reviewId:** `2`

---

### TEST CASE 9.3: Get All Reviews
**Objective:** Retrieve all product reviews for administrative purposes
**Business Logic:** Administrative view of all customer reviews

**HTTP Method:** `GET`
**Endpoint:** `/api/reviews`
**Authorization:** Session-based (may require admin privileges)

**Expected Response (HTTP 200):**
```json
[
    {
        "reviewId": 1,
        "user": {
            "userId": 1,
            "username": "testuser001"
        },
        "product": {
            "productId": 1,
            "name": "iPhone 15 Pro Max"
        },
        "rating": 5,
        "comment": "Excellent product! The iPhone 15 Pro Max exceeded my expectations. Great camera quality and performance.",
        "reviewDate": "2024-01-18T09:00:00"
    },
    {
        "reviewId": 2,
        "user": {
            "userId": 1,
            "username": "testuser001"
        },
        "product": {
            "productId": 2,
            "name": "Premium Cotton T-Shirt"
        },
        "rating": 4,
        "comment": "Good quality t-shirt. Comfortable fabric and nice fit. Delivery was prompt.",
        "reviewDate": "2024-01-18T09:15:00"
    }
]
```

---

### TEST CASE 9.4: Get Review by ID
**Objective:** Retrieve specific review details
**Prerequisites:** Valid reviewId

**HTTP Method:** `GET`
**Endpoint:** `/api/reviews/1`
**Authorization:** None required (public reviews)

**Expected Response (HTTP 200):**
```json
{
    "reviewId": 1,
    "user": {
        "userId": 1,
        "username": "testuser001"
    },
    "product": {
        "productId": 1,
        "name": "iPhone 15 Pro Max"
    },
    "rating": 5,
    "comment": "Excellent product! The iPhone 15 Pro Max exceeded my expectations. Great camera quality and performance.",
    "reviewDate": "2024-01-18T09:00:00"
}
```

---

### TEST CASE 9.5: Update Product Review
**Objective:** Allow customers to modify their existing reviews
**Business Logic:** Users can edit their own reviews within time constraints
**Prerequisites:** Valid reviewId and review ownership

**HTTP Method:** `PUT`
**Endpoint:** `/api/reviews/1`
**Authorization:** Session-based (review owner only)

**Request Body:**
```json
{
    "rating": 5,
    "comment": "UPDATED: Excellent product! The iPhone 15 Pro Max exceeded my expectations. After using for a week, I'm even more impressed with the camera quality and performance."
}
```

**Expected Response (HTTP 200):**
```json
{
    "reviewId": 1,
    "rating": 5,
    "comment": "UPDATED: Excellent product! The iPhone 15 Pro Max exceeded my expectations. After using for a week, I'm even more impressed with the camera quality and performance.",
    "reviewDate": "2024-01-18T09:00:00",
    "lastModified": "2024-01-19T10:30:00"
}
```

**Business Constraints:**
- **Ownership:** Users can only edit their own reviews
- **Time Limits:** May restrict editing after certain period
- **Audit Trail:** Track modification history

---

### TEST CASE 9.6: Review Validation (Negative Flows)
**Objective:** Validate review creation constraints

**Sub-test 9.6a: Invalid Rating Range**
**HTTP Method:** `POST`
**Endpoint:** `/api/reviews`

**Request Body:**
```json
{
    "user": {
        "userId": 1
    },
    "product": {
        "productId": 1
    },
    "rating": 6,
    "comment": "Invalid rating test"
}
```

**Expected Response (HTTP 400):**
```json
{
    "error": "Rating must be between 1 and 5"
}
```

**Sub-test 9.6b: Review Without Purchase**
**Request Body:**
```json
{
    "user": {
        "userId": 1
    },
    "product": {
        "productId": 999
    },
    "rating": 5,
    "comment": "Review without purchase"
}
```

**Expected Response (HTTP 400):**
```json
{
    "error": "You can only review products you have purchased"
}
```

## Phase 10: AI Chat Support

### TEST CASE 10.1: Customer Support Chat Query
**Objective:** Provide AI-powered customer support through chat interface
**Business Logic:** Integrates with Hugging Face API for intelligent responses
**Prerequisites:** Hugging Face API configuration and internet connectivity

**HTTP Method:** `POST`
**Endpoint:** `/api/chat`
**Authorization:** Session-based (authenticated user recommended)

**Request Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
    "message": "I need help with tracking my order. My order ID is 1."
}
```

**Expected Response (HTTP 200):**
```json
{
    "response": "I'd be happy to help you track your order! For Order ID 1, I can see it's currently in DELIVERED status. Your order was delivered on 2024-01-17. If you have any concerns about your delivery, please let me know how I can assist further."
}
```

**AI Integration Features:**
- **Natural Language Processing:** Understands customer queries in plain English
- **Context Awareness:** May access order/user data for personalized responses
- **Multi-topic Support:** Handles various customer service scenarios

**Common Chat Scenarios:**
- Order status inquiries
- Product information requests
- Return and refund policies
- Account-related questions
- Technical support

---

### TEST CASE 10.2: Product Information Query
**Objective:** Get product details through conversational interface

**HTTP Method:** `POST`
**Endpoint:** `/api/chat`

**Request Body:**
```json
{
    "message": "Tell me about the iPhone 15 Pro Max. What are its key features?"
}
```

**Expected Response (HTTP 200):**
```json
{
    "response": "The iPhone 15 Pro Max is our premium smartphone featuring the A17 Pro chip, titanium design, and advanced camera system. It's priced at $1199.99 and currently in stock. Would you like more details about any specific features or need help with purchasing?"
}
```

---

### TEST CASE 10.3: General Support Query
**Objective:** Handle general customer service inquiries

**HTTP Method:** `POST`
**Endpoint:** `/api/chat`

**Request Body:**
```json
{
    "message": "What is your return policy?"
}
```

**Expected Response (HTTP 200):**
```json
{
    "response": "Our return policy allows returns within 30 days of delivery for most items. Items must be in original condition with packaging. To initiate a return, please contact our customer service team or use your account dashboard. Is there a specific item you'd like to return?"
}
```

---

### TEST CASE 10.4: Chat Error Handling (Negative Flow)
**Objective:** Validate chat service error scenarios

**Sub-test 10.4a: Empty Message**
**HTTP Method:** `POST`
**Endpoint:** `/api/chat`

**Request Body:**
```json
{
    "message": ""
}
```

**Expected Response (HTTP 400):**
```json
{
    "error": "Message cannot be empty"
}
```

**Sub-test 10.4b: Service Unavailable**
*(Simulated when Hugging Face API is down)*

**Expected Response (HTTP 500):**
```json
{
    "error": "Chat service temporarily unavailable. Please try again later."
}
```

---

## Phase 11: Email Service Testing

### TEST CASE 11.1: Email Service Functionality Test
**Objective:** Verify email notification system
**Business Logic:** Tests SMTP configuration and email delivery
**Prerequisites:** SMTP server configuration in application.properties

**HTTP Method:** `GET`
**Endpoint:** `/api/payments/test-email`
**Authorization:** Session-based (admin access recommended)

**Expected Response (HTTP 200):**
```
Email sent!
```

**Email Delivery Verification:**
- **Recipient:** Configured test email address
- **Subject:** "Test Email"
- **Content:** "This is a test email."
- **Delivery Time:** Should be received within minutes

**Email Service Integration Points:**
- **User Registration:** Welcome email
- **Order Confirmation:** Order details email
- **Payment Confirmation:** Payment success email
- **Order Status Updates:** Shipping notifications
- **Password Reset:** Security emails

**SMTP Configuration Requirements:**
- **Host:** SMTP server address
- **Port:** SMTP port (587 for TLS, 465 for SSL)
- **Authentication:** Username and password
- **Security:** TLS/SSL encryption

---

## Phase 12: Administrative Operations

### TEST CASE 12.1: Admin - Get All Users
**Objective:** Administrative view of all registered users
**Business Logic:** User management for customer service and analytics
**Prerequisites:** Admin privileges

**HTTP Method:** `GET`
**Endpoint:** `/api/users`
**Authorization:** Session-based (admin access required)

**Expected Response (HTTP 200):**
```json
[
    {
        "userId": 1,
        "username": "testuser001",
        "email": "testuser001@example.com",
        "role": "USER"
    }
]
```

**Administrative Features:**
- **User Statistics:** Total user count
- **Account Status:** Active/inactive users
- **Registration Trends:** User growth analytics
- **Security:** Password excluded from response

---

### TEST CASE 12.2: Admin - Get All Categories
**Objective:** Category management for catalog administration

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

---

### TEST CASE 12.3: Admin - Update Product Information
**Objective:** Product catalog management
**Business Logic:** Update product details, pricing, and availability
**Prerequisites:** Valid productId and admin access

**HTTP Method:** `PUT`
**Endpoint:** `/api/products/1`
**Authorization:** Session-based (admin access)

**Request Body:**
```json
{
    "name": "iPhone 15 Pro Max (Updated)",
    "description": "Latest iPhone with A17 Pro chip, titanium design, and advanced camera system. Now with extended warranty.",
    "price": 1099.99,
    "stockQuantity": 75,
    "size": "L",
    "imageUrl": "https://example.com/images/iphone15promax-updated.jpg"
}
```

**Expected Response (HTTP 200):**
```json
{
    "productId": 1,
    "name": "iPhone 15 Pro Max (Updated)",
    "description": "Latest iPhone with A17 Pro chip, titanium design, and advanced camera system. Now with extended warranty.",
    "price": 1099.99,
    "stockQuantity": 75,
    "size": "L",
    "imageUrl": "https://example.com/images/iphone15promax-updated.jpg"
}
```

**Product Management Features:**
- **Price Updates:** Dynamic pricing management
- **Inventory Control:** Stock level adjustments
- **Product Information:** Description and image updates
- **Availability:** Enable/disable product sales

---

### TEST CASE 12.4: Admin - Delete Operations (Negative Flow)
**Objective:** Validate referential integrity constraints
**Business Logic:** Prevent deletion of referenced entities

**Sub-test 12.4a: Delete Product with Order History**
**HTTP Method:** `DELETE`
**Endpoint:** `/api/products/1`

**Expected Response (HTTP 400 or 409):**
```json
{
    "error": "Cannot delete product with existing order history",
    "constraint": "Foreign key constraint violation"
}
```

**Sub-test 12.4b: Delete Category with Products**
**HTTP Method:** `DELETE`
**Endpoint:** `/api/categories/1`

**Expected Response (HTTP 400 or 409):**
```json
{
    "error": "Cannot delete category with associated products",
    "associatedProducts": 1
}
```

**Data Integrity Protection:**
- **Order History:** Preserve product data for completed orders
- **Financial Records:** Maintain payment and transaction history
- **User Data:** Protect customer information and privacy
- **Audit Trail:** Keep modification logs for compliance

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