-- Update customer_name in orders table where it's NULL but user information exists
UPDATE orders o
JOIN users u ON o.user_id = u.user_id
SET o.customer_name = u.username
WHERE o.customer_name IS NULL AND u.username IS NOT NULL;

-- Update email in orders table where it's NULL but user information exists
UPDATE orders o
JOIN users u ON o.user_id = u.user_id
SET o.email = u.email
WHERE o.email IS NULL AND u.email IS NOT NULL;

-- Update order_date to current timestamp where it's NULL
UPDATE orders
SET order_date = CURRENT_TIMESTAMP
WHERE order_date IS NULL;

-- Update shipping_address to 'Default Address' where it's NULL
UPDATE orders
SET shipping_address = 'Default Address'
WHERE shipping_address IS NULL;

-- Update status to 'PENDING' where it's NULL
UPDATE orders
SET status = 'PENDING'
WHERE status IS NULL; 