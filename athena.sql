-- MariaDB dump 10.19  Distrib 10.4.32-MariaDB, for Win64 (AMD64)
--
-- Host: localhost    Database: athena
-- ------------------------------------------------------
-- Server version	9.1.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `addresses`
--

DROP TABLE IF EXISTS `addresses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `addresses` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `address_line1` varchar(255) NOT NULL,
  `address_line2` varchar(255) DEFAULT NULL,
  `address_type` varchar(255) NOT NULL,
  `city` varchar(255) NOT NULL,
  `country` varchar(255) NOT NULL,
  `is_default` bit(1) NOT NULL,
  `postal_code` varchar(255) NOT NULL,
  `state` varchar(255) NOT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK1fa36y2oqhao3wgg2rw1pi459` (`user_id`),
  CONSTRAINT `FK1fa36y2oqhao3wgg2rw1pi459` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `addresses`
--

LOCK TABLES `addresses` WRITE;
/*!40000 ALTER TABLE `addresses` DISABLE KEYS */;
INSERT INTO `addresses` VALUES (1,'Near Cardinal School Khar East Bandra East',' 1/4, Rajkishor Baba Chawl, Jaihind Nagar','BOTH','Mumbai Urban','India','','400051','Mumbai Mumbai Mumbai Maharashtra',20),(2,'Raj Kishore chawl Jai Hind Nagar Khar East',' 1/4, Rajkishor Baba Chawl, Jaihind Nagar','SHIPPING','Andheri','India','','400051','Maharashtra',19),(3,'Raj Kishore chawl Jai Hind Nagar Khar East','','SHIPPING','Andheri','India','','400051','Maharashtra',22);
/*!40000 ALTER TABLE `addresses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `categories` (
  `category_id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `description` text,
  PRIMARY KEY (`category_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (1,'Men\'s Clothing','Modern men\'s fashion'),(2,'Women\'s Clothing','Trendy women\'s apparel'),(3,'Kids\' Clothing','Stylish kids\' wear'),(4,'Accessories','Fashion accessories like scarves and belts'),(5,'Men\'s Clothing','Clothing for men');
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_details`
--

DROP TABLE IF EXISTS `order_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `order_details` (
  `order_detail_id` bigint NOT NULL AUTO_INCREMENT,
  `price` decimal(10,2) NOT NULL,
  `quantity` int NOT NULL,
  `order_id` bigint NOT NULL,
  `product_id` bigint NOT NULL,
  PRIMARY KEY (`order_detail_id`),
  KEY `FKjyu2qbqt8gnvno9oe9j2s2ldk` (`order_id`),
  KEY `FK4q98utpd73imf4yhttm3w0eax` (`product_id`),
  CONSTRAINT `FK4q98utpd73imf4yhttm3w0eax` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`),
  CONSTRAINT `FKjyu2qbqt8gnvno9oe9j2s2ldk` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_details`
--

LOCK TABLES `order_details` WRITE;
/*!40000 ALTER TABLE `order_details` DISABLE KEYS */;
INSERT INTO `order_details` VALUES (1,999.00,2,1,1),(2,2999.00,1,2,4),(3,699.00,3,3,7),(4,19.99,1,37,11),(5,799.00,1,38,1),(6,699.00,3,39,7),(7,799.00,1,40,3),(8,499.00,1,41,12),(9,799.00,1,42,2),(10,2499.00,1,43,7),(11,2499.00,1,44,7),(12,2499.00,1,45,7),(13,2499.00,1,46,7),(14,699.00,1,47,3),(15,699.00,1,48,3),(16,699.00,1,49,3),(17,699.00,1,50,3),(18,699.00,1,51,3),(19,19.99,1,52,11),(20,19.99,1,53,11),(21,19.99,1,54,11),(22,19.99,1,55,11),(23,19.99,1,56,11),(24,19.99,1,57,11);
/*!40000 ALTER TABLE `order_details` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `orders` (
  `order_id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` bigint DEFAULT NULL,
  `total_amount` decimal(10,2) NOT NULL,
  `status` enum('PENDING','PROCESSING','SHIPPED','DELIVERED','CANCELLED') DEFAULT 'PENDING',
  `billing_address` text,
  `customer_name` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `order_date` datetime(6) DEFAULT NULL,
  `payment_method` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `shipping_address` text,
  PRIMARY KEY (`order_id`),
  KEY `idx_user_id_orders` (`user_id`),
  CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=58 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (1,1,1998.00,'DELIVERED',NULL,'user','user@gmail.com',NULL,NULL,NULL,NULL),(2,2,2999.00,'DELIVERED',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(3,3,2097.00,'DELIVERED',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(4,5,4999.00,'DELIVERED',NULL,'Rakesh Gupta','zatchbell5zakerka@gmail.com',NULL,NULL,NULL,NULL),(5,7,1998.00,'SHIPPED',NULL,NULL,NULL,'2025-03-21 14:13:12.432256',NULL,NULL,NULL),(6,1,999.00,'DELIVERED',NULL,'user','user@gmail.com','2025-03-21 23:54:09.380131',NULL,NULL,NULL),(7,1,1399.00,'SHIPPED',NULL,NULL,NULL,'2025-03-22 11:30:46.065483',NULL,NULL,NULL),(8,12,19.99,'SHIPPED',NULL,NULL,NULL,'2025-03-22 12:42:09.920430',NULL,NULL,NULL),(10,20,4999.00,'DELIVERED',NULL,'Aryan Y','aryan@gmail.com','2025-03-23 16:00:41.508136',NULL,NULL,NULL),(11,20,699.00,'PENDING',NULL,NULL,NULL,'2025-03-23 16:13:08.574690',NULL,NULL,NULL),(12,19,4999.00,'PROCESSING',NULL,'user123','user123@gmail.com','2025-03-23 16:18:40.656892',NULL,NULL,NULL),(13,19,4999.00,'PENDING',NULL,NULL,NULL,'2025-03-23 16:24:44.925890',NULL,NULL,NULL),(14,20,799.00,'PROCESSING',NULL,'Aryan Y','aryan@gmail.com','2025-03-23 16:28:15.868774',NULL,NULL,NULL),(15,20,4999.00,'PENDING',NULL,NULL,NULL,'2025-03-23 16:33:45.857498',NULL,NULL,NULL),(16,1,4999.00,'DELIVERED',NULL,'user','user@gmail.com','2025-03-23 16:38:39.501759',NULL,NULL,NULL),(17,20,799.00,'PENDING',NULL,NULL,NULL,'2025-03-23 18:14:06.348432',NULL,NULL,NULL),(18,20,4999.00,'PROCESSING',NULL,'Aryan Y','aryan@gmail.com','2025-03-23 18:17:45.495647',NULL,NULL,NULL),(19,20,799.00,'PROCESSING',NULL,'Aryan Y','aryan@gmail.com','2025-03-23 18:20:13.205806',NULL,NULL,NULL),(20,20,799.00,'PENDING',NULL,NULL,NULL,'2025-03-23 18:23:48.004144',NULL,NULL,NULL),(21,20,799.00,'PENDING',NULL,NULL,NULL,'2025-03-23 18:26:48.854139',NULL,NULL,NULL),(22,20,799.00,'PENDING',NULL,NULL,NULL,'2025-03-23 18:28:11.365487',NULL,NULL,NULL),(23,20,4999.00,'PENDING',NULL,NULL,NULL,'2025-03-24 00:04:09.521085',NULL,NULL,NULL),(24,20,2999.00,'PENDING',NULL,NULL,NULL,'2025-03-24 10:05:54.649373',NULL,NULL,NULL),(25,20,499.00,'PENDING',NULL,NULL,NULL,'2025-03-24 10:13:03.312544',NULL,NULL,NULL),(26,20,2397.00,'PENDING',NULL,NULL,NULL,'2025-03-24 10:27:24.918331',NULL,NULL,NULL),(27,20,1497.00,'DELIVERED',NULL,'Aryan Y','aryan@gmail.com','2025-03-24 10:43:00.065173',NULL,NULL,NULL),(28,22,1499.00,'PENDING',', , , , India','Abhishek','abhishek@gmail.com','2025-03-24 14:32:28.243266','cod','982989289',', , , , India'),(29,22,1399.00,'DELIVERED',', , , , India','Abhishek','abhishek@gmail.com','2025-03-24 15:11:57.421171','cod','982989289',', , , , India'),(30,22,1399.00,'PENDING',', , , , India','Abhishek','abhishek@gmail.com','2025-03-24 15:22:39.380359','cod','+91(7715) 820 - 632',', , , , India'),(31,22,39.98,'SHIPPED',', , , , India','Abhishek','abhishek@gmail.com','2025-03-24 15:43:30.870999','cod','+91(7715) 820 - 632',', , , , India'),(32,22,799.00,'CANCELLED',', , , , India','Abhishek','abhishek@gmail.com','2025-03-24 15:52:38.275794','cod','+91(7715) 820 - 632',', , , , India'),(33,22,399.00,'PROCESSING',', , , , India','Nimesh','abhishek@gmail.com','2025-03-24 17:04:07.029254','cod','982989289',', , , , India'),(34,22,1198.00,'PROCESSING',', , , , India','New ABhishek Order','abhishek@gmail.com','2025-03-25 11:30:32.646064','cod','4984925823',', , , , India'),(35,22,2097.00,'PENDING',', , , , India','Abhishek','abhishek@gmail.com','2025-03-25 11:34:47.224598','cod','7715820632',', , , , India'),(36,22,2097.00,'PENDING',', , , , India','Abhishek','abhishek@gmail.com','2025-03-25 11:39:09.918603','cod','49849258',', , , , India'),(37,22,19.99,'PROCESSING',', , , , India','Abhishek','abhishek@gmail.com','2025-03-25 11:41:43.900930','cod','7715820632',', , , , India'),(38,18,799.00,'PROCESSING',', , , , India','Admin123','admin123@gmail.com','2025-03-25 13:46:05.917888','cod','982989289',', , , , India'),(39,22,2097.00,'PROCESSING',', , , , India','Abhishek','abhishek@gmail.com','2025-03-25 14:00:01.456606','cod','7715820632',', , , , India'),(40,22,799.00,'PROCESSING','Raj Kishore chawl Jai Hind Nagar Khar East, Andheri, Maharashtra, 400051, India','Abhishek','abhishek@gmail.com','2025-03-25 23:48:51.655117','cod','982989289','Raj Kishore chawl Jai Hind Nagar Khar East, Andheri, Maharashtra, 400051, India'),(41,22,499.00,'DELIVERED','Raj Kishore chawl Jai Hind Nagar Khar East, Andheri, Maharashtra, 400051, India','Abhishek','abhishek@gmail.com','2025-03-25 23:52:19.566198','cod','4984925823','Raj Kishore chawl Jai Hind Nagar Khar East, Andheri, Maharashtra, 400051, India'),(42,22,799.00,'PENDING','Raj Kishore chawl Jai Hind Nagar Khar East, Andheri, Maharashtra, 400051, India','Abhishek','abhishek@gmail.com','2025-03-26 14:53:56.062029','cod','982989289','Raj Kishore chawl Jai Hind Nagar Khar East, Andheri, Maharashtra, 400051, India'),(43,22,2499.00,'PENDING','Raj Kishore chawl Jai Hind Nagar Khar East, Andheri, Maharashtra, 400051, India','Abhishek','abhishek@gmail.com','2025-03-26 14:59:46.383226','razorpay','7715820632','Raj Kishore chawl Jai Hind Nagar Khar East, Andheri, Maharashtra, 400051, India'),(44,22,2499.00,'PENDING','Raj Kishore chawl Jai Hind Nagar Khar East, Andheri, Maharashtra, 400051, India','Aryan','abhishek@gmail.com','2025-03-26 15:01:00.241000','razorpay','7715820632','Raj Kishore chawl Jai Hind Nagar Khar East, Andheri, Maharashtra, 400051, India'),(45,22,2499.00,'PENDING','Raj Kishore chawl Jai Hind Nagar Khar East, Andheri, Maharashtra, 400051, India','Abhishek','abhishek@gmail.com','2025-03-26 15:07:36.379963','razorpay','7715820632','Raj Kishore chawl Jai Hind Nagar Khar East, Andheri, Maharashtra, 400051, India'),(46,22,2499.00,'PENDING','Raj Kishore chawl Jai Hind Nagar Khar East, Andheri, Maharashtra, 400051, India','Abhishek','abhishek@gmail.com','2025-03-26 15:11:58.626314','razorpay','7715820632','Raj Kishore chawl Jai Hind Nagar Khar East, Andheri, Maharashtra, 400051, India'),(47,22,699.00,'PENDING','Raj Kishore chawl Jai Hind Nagar Khar East, Andheri, Maharashtra, 400051, India','Abhishek','abhishek@gmail.com','2025-03-26 15:32:13.488312','razorpay','7715820632','Raj Kishore chawl Jai Hind Nagar Khar East, Andheri, Maharashtra, 400051, India'),(48,22,699.00,'PENDING','Raj Kishore chawl Jai Hind Nagar Khar East, Andheri, Maharashtra, 400051, India','Abhishek','abhishek@gmail.com','2025-03-26 15:33:59.982233','razorpay','7715820632','Raj Kishore chawl Jai Hind Nagar Khar East, Andheri, Maharashtra, 400051, India'),(49,22,699.00,'PENDING','Raj Kishore chawl Jai Hind Nagar Khar East, Andheri, Maharashtra, 400051, India','Abhishek','abhishek@gmail.com','2025-03-26 15:37:41.929920','razorpay','7715820632','Raj Kishore chawl Jai Hind Nagar Khar East, Andheri, Maharashtra, 400051, India'),(50,22,699.00,'PENDING','Raj Kishore chawl Jai Hind Nagar Khar East, Andheri, Maharashtra, 400051, India','Abhishek','abhishek@gmail.com','2025-03-26 15:40:24.736230','razorpay','7715820632','Raj Kishore chawl Jai Hind Nagar Khar East, Andheri, Maharashtra, 400051, India'),(51,22,699.00,'DELIVERED','Raj Kishore chawl Jai Hind Nagar Khar East, Andheri, Maharashtra, 400051, India','Aryan','abhishek@gmail.com','2025-03-26 15:43:53.612793','razorpay','7715820632','Raj Kishore chawl Jai Hind Nagar Khar East, Andheri, Maharashtra, 400051, India'),(52,22,19.99,'PENDING','Raj Kishore chawl Jai Hind Nagar Khar East, Andheri, Maharashtra, 400051, India','Aryan','abhishek@gmail.com','2025-03-26 15:46:11.941306','cod','7715820632','Raj Kishore chawl Jai Hind Nagar Khar East, Andheri, Maharashtra, 400051, India'),(53,22,19.99,'PENDING','Raj Kishore chawl Jai Hind Nagar Khar East, Andheri, Maharashtra, 400051, India','Rakesh Gupta','abhishek@gmail.com','2025-03-26 15:46:40.252683','razorpay','7715820632','Raj Kishore chawl Jai Hind Nagar Khar East, Andheri, Maharashtra, 400051, India'),(54,22,19.99,'PENDING','Raj Kishore chawl Jai Hind Nagar Khar East, Andheri, Maharashtra, 400051, India','Rakesh Gupta','abhishek@gmail.com','2025-03-26 15:49:40.152628','razorpay','7715820632','Raj Kishore chawl Jai Hind Nagar Khar East, Andheri, Maharashtra, 400051, India'),(55,22,19.99,'PROCESSING','Raj Kishore chawl Jai Hind Nagar Khar East, Andheri, Maharashtra, 400051, India','Rakesh Gupta','abhishek@gmail.com','2025-03-26 15:53:19.964419','razorpay','7715820632','Raj Kishore chawl Jai Hind Nagar Khar East, Andheri, Maharashtra, 400051, India'),(56,22,19.99,'SHIPPED','Raj Kishore chawl Jai Hind Nagar Khar East, Andheri, Maharashtra, 400051, India','Rakesh Gupta','abhishek@gmail.com','2025-03-26 15:55:24.699273','razorpay','7715820632','Raj Kishore chawl Jai Hind Nagar Khar East, Andheri, Maharashtra, 400051, India'),(57,22,19.99,'DELIVERED','Raj Kishore chawl Jai Hind Nagar Khar East, Andheri, Maharashtra, 400051, India','Rakesh Gupta','abhishek@gmail.com','2025-03-26 15:56:57.468747','razorpay','7715820632','Raj Kishore chawl Jai Hind Nagar Khar East, Andheri, Maharashtra, 400051, India');
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payments`
--

DROP TABLE IF EXISTS `payments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `payments` (
  `payment_id` bigint NOT NULL AUTO_INCREMENT,
  `order_id` bigint DEFAULT NULL,
  `payment_method` varchar(50) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `status` enum('PENDING','COMPLETED','FAILED') DEFAULT 'PENDING',
  `transaction_id` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`payment_id`),
  KEY `idx_order_id_payments` (`order_id`),
  CONSTRAINT `payments_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payments`
--

LOCK TABLES `payments` WRITE;
/*!40000 ALTER TABLE `payments` DISABLE KEYS */;
INSERT INTO `payments` VALUES (1,1,'UPI',1998.00,'COMPLETED','TXN12345'),(2,2,'Credit Card',2999.00,'COMPLETED','TXN67890'),(3,3,'Cash on Delivery',2097.00,'COMPLETED','TXN11223');
/*!40000 ALTER TABLE `payments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `products` (
  `product_id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `description` text,
  `price` decimal(10,2) NOT NULL,
  `stock_quantity` int NOT NULL,
  `category_id` bigint DEFAULT NULL,
  `size` enum('S','M','L','XL','XXL') DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`product_id`),
  KEY `category_id` (`category_id`),
  CONSTRAINT `products_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`category_id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (1,'Light Green Hoodie','Cozy light green hoodie with a V-neck design',999.00,50,1,'M','https://i.imgur.com/JiSestW.jpeg'),(2,'Floral Short-Sleeve Shirt','Vibrant floral short-sleeve shirt with a red, green, and orange pattern, perfect for casual outings',799.00,40,2,'L','https://i.imgur.com/rr9G3tG.jpeg'),(3,'Distressed Denim Shorts','Light blue denim shorts with a distressed, ripped design, perfect for a casual summer look',699.00,30,1,'XL','https://i.imgur.com/EdjAAVY.jpeg'),(4,'Black Short-Sleeve T-Shirt','Classic black short-sleeve T-shirt, perfect for casual wear and easy pairing',499.00,60,2,'M','https://i.imgur.com/v2hg9WB.jpeg'),(5,'White Short-Sleeve T-Shirt','Classic white short-sleeve T-shirt, perfect for casual wear and versatile styling',499.00,60,1,'M','https://i.imgur.com/B4LiX6y.jpeg'),(6,'Green Casual Pants','Comfortable green casual pants with a relaxed fit, perfect for everyday wear',999.00,35,2,'L','https://i.imgur.com/igMS5l4.jpeg'),(7,'Black Embellished Coat','Stylish black coat with unique patches and embellishments, perfect for a bold, artistic look',2499.00,20,3,'S','https://i.imgur.com/vw97FOy.jpeg'),(8,'Gap Girls Dress','Gap skater dress for girls',1499.00,25,3,'M','https://i.imgur.com/qJ6yYtr.jpg'),(9,'Burberry Scarf','Burberry lightweight scarf',499.00,70,4,NULL,'https://i.imgur.com/qJ6yYtr.jpg'),(10,'Fossil Belt','Fossil leather belt',399.00,80,4,NULL,'https://i.imgur.com/qJ6yYtr.jpg'),(11,'Men\'s T-Shirt','Comfortable cotton t-shirt for men updated',19.99,100,1,'M','https://i.imgur.com/2Ve42zb.jpg'),(12,'Fossil Belt - Variant 1','Fossil leather belt with a unique buckle',499.00,50,4,'M','https://i.imgur.com/qJ6yYtr.jpg'),(13,'Fossil Belt - Variant 2','Fossil leather belt with a different buckle',599.00,30,4,'L','https://i.imgur.com/qJ6yYtr.jpg'),(14,'Navy and Grey Striped Sweater','A cozy navy blue and grey striped sweater with a textured knit pattern. Features a round neckline and a casual fit, perfect for cool weather. Made from a soft, warm material ideal for layering',1399.00,20,1,'M','https://i.imgur.com/i4C3lYo.jpeg'),(15,'Dark Plaid Flannel Shirt','Dark plaid flannel shirt with a black, grey, and brown checkered pattern, perfect for a cozy, casual look',1199.00,25,1,'M','https://i.imgur.com/nUY4cag.jpeg'),(16,'Floral Rose Dress','Elegant floral dress with pink and white rose pattern, lace-trimmed sleeves, pink ribbon waist, and tulle underskirt, perfect for special occasions',1499.00,15,3,'S','https://i.imgur.com/anerkia.jpeg');
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reviews`
--

DROP TABLE IF EXISTS `reviews`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `reviews` (
  `review_id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` bigint DEFAULT NULL,
  `product_id` bigint DEFAULT NULL,
  `rating` int NOT NULL,
  `comment` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`review_id`),
  KEY `idx_user_id_reviews` (`user_id`),
  KEY `idx_product_id_reviews` (`product_id`),
  CONSTRAINT `reviews_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`),
  CONSTRAINT `reviews_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reviews`
--

LOCK TABLES `reviews` WRITE;
/*!40000 ALTER TABLE `reviews` DISABLE KEYS */;
INSERT INTO `reviews` VALUES (1,1,1,4,'Great Nike tee, super comfy!','2025-03-26 10:34:04'),(3,3,7,3,'Adidas hoodie is okay, shrank slightly.','2025-03-26 10:34:04'),(4,22,12,4,'Review Testing for a products editing working.','2025-03-26 10:34:04'),(5,22,11,2,'Done Testing','2025-03-26 10:35:40');
/*!40000 ALTER TABLE `reviews` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `shopping_cart`
--

DROP TABLE IF EXISTS `shopping_cart`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `shopping_cart` (
  `cart_id` bigint NOT NULL AUTO_INCREMENT,
  `quantity` int NOT NULL,
  `product_id` bigint NOT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`cart_id`),
  KEY `FK26ajdolmyw3a95bhn6pjk5dor` (`product_id`),
  KEY `FKr1irjigmqcpfrvggavnr7vjyv` (`user_id`),
  CONSTRAINT `FK26ajdolmyw3a95bhn6pjk5dor` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`),
  CONSTRAINT `FKr1irjigmqcpfrvggavnr7vjyv` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `shopping_cart`
--

LOCK TABLES `shopping_cart` WRITE;
/*!40000 ALTER TABLE `shopping_cart` DISABLE KEYS */;
INSERT INTO `shopping_cart` VALUES (1,2,1,1),(2,1,4,2),(3,3,7,3);
/*!40000 ALTER TABLE `shopping_cart` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `user_id` bigint NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('USER','ADMIN','SUPER_ADMIN') DEFAULT 'USER',
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'user','user@gmail.com','password123','USER'),(2,'admin','admin@gmail.com','password123','ADMIN'),(3,'superadmin','superadmin@gmail.com','password123','SUPER_ADMIN'),(5,'Rakesh Gupta','zatchbell5zakerka@gmail.com','guest-1742540268107','USER'),(7,'Abhishek','webcoderak@gmail.com','guest-1742546592253','USER'),(12,'Damn','nimeshdj123@gmail.com','password123','USER'),(18,'admin123','admin123@gmail.com','$2a$10$L2XvzaLicaQ55wwFlVBfeuyVzyXAF95Qkx8r3.DtaeHkJbqISQ0D6','ADMIN'),(19,'user123','user123@gmail.com','$2a$10$.wTpitpZN2GfnUWAxZMuWeTxIA/KBCKCWQZsBO4BxFhGuouIz3guW','USER'),(20,'Aryan Y','aryan@gmail.com','$2a$10$r/Gb35nYztzvZAfF/acKUe12sPZQQBKy8hyV8Kh1k.d0giKHz0uXO','USER'),(22,'Abhishek bro','abhishek@gmail.com','$2a$10$n.mnRakP6r3E2fVelaS.BeqppnHvweWQ8F2DE6/es3h9DSqGgy.lS','USER');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `wishlist`
--

DROP TABLE IF EXISTS `wishlist`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `wishlist` (
  `wishlist_id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` bigint DEFAULT NULL,
  `product_id` bigint DEFAULT NULL,
  PRIMARY KEY (`wishlist_id`),
  KEY `idx_user_id_wishlist` (`user_id`),
  KEY `idx_product_id_wishlist` (`product_id`),
  CONSTRAINT `wishlist_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`),
  CONSTRAINT `wishlist_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=39 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `wishlist`
--

LOCK TABLES `wishlist` WRITE;
/*!40000 ALTER TABLE `wishlist` DISABLE KEYS */;
INSERT INTO `wishlist` VALUES (3,3,6),(4,1,4),(5,1,8),(7,1,3),(8,12,11),(10,19,3),(11,20,2),(12,19,2),(14,20,12),(15,20,3),(16,1,12),(17,1,2),(25,1,14),(28,1,7),(32,18,16),(34,22,3),(36,22,11),(37,22,4);
/*!40000 ALTER TABLE `wishlist` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-03-26 16:09:44
