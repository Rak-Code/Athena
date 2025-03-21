package com.example.backend.services;

import com.example.backend.model.Product;
import com.example.backend.repository.ProductRepository;
import jakarta.validation.constraints.Size;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private WishlistService wishlistService; // Inject WishlistService

    // Create a new product
    public Product createProduct(Product product) {
        return productRepository.save(product);
    }

    // Get all products
    public List<Product> getAllProducts() {
        List<Product> products = productRepository.findAll();
        System.out.println("Fetched Products: " + products.size()); // Check how many are returned
        return products;
    }


    // Get product by ID
    public Optional<Product> getProductById(Long productId) {
        return productRepository.findById(productId);
    }

    // Update product
    public Product updateProduct(Long productId, Product productDetails) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + productId));
        product.setName(productDetails.getName());
        product.setDescription(productDetails.getDescription());
        product.setPrice(productDetails.getPrice());
        product.setStockQuantity(productDetails.getStockQuantity());
        product.setSize(productDetails.getSize());
        product.setImageUrl(productDetails.getImageUrl());
        product.setCategory(productDetails.getCategory());
        return productRepository.save(product);
    }

    // Delete product
    @Transactional
    public void deleteProduct(Long productId) {
        // Check if the product exists
        if (!productRepository.existsById(productId)) {
            throw new RuntimeException("Product not found with id: " + productId);
        }

        // Remove all wishlist entries referencing this product
        wishlistService.removeByProductId(productId);

        // Delete the product
        productRepository.deleteById(productId);
    }

    // Find products by category ID
    public List<Product> findByCategoryId(Long categoryId) {
        return productRepository.findByCategory_CategoryId(categoryId);
    }

    // Search products by name (case-insensitive)
    public List<Product> findByNameContainingIgnoreCase(String name) {
        return productRepository.findByNameContainingIgnoreCase(name);
    }

    // ... other imports and code ...
    public List<Product> filterProducts(Long categoryId, BigDecimal minPrice, BigDecimal maxPrice, Product.Size size, Boolean inStock) {
        return productRepository.findByFilters(categoryId, minPrice, maxPrice, size, inStock);
    }
}