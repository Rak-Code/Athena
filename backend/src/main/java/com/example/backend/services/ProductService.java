package com.example.backend.services;

import com.example.backend.model.Category;
import com.example.backend.model.Product;
import com.example.backend.repository.CategoryRepository;
import com.example.backend.repository.ProductRepository;
import jakarta.validation.constraints.Size;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheConfig;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.CachePut;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Service
@CacheConfig(cacheNames = "products")
public class ProductService {
	
	@Autowired
	private CategoryRepository categoryRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private WishlistService wishlistService; // Inject WishlistService

    // Create a new product
    @Caching(
    		put = {
    				@CachePut(key = "#result.productId")
    		},
    		evict = {
    				@CacheEvict(key = "'allproducts'")
    		}
    		
    		)
    public Product createProduct(Product product) {
        if (product.getCategory() == null || product.getCategory().getCategoryId() == null) {
            throw new RuntimeException("Category is required");
        }

        Category category = categoryRepository.findById(product.getCategory().getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found"));

        product.setCategory(category);
        return productRepository.save(product);
    }



    // Get all products
    @Cacheable(key = "'allproducts'")
    public List<Product> getAllProducts() {
        List<Product> products = productRepository.findAll();
        System.out.println("Fetched Products: " + products.size()); // Check how many are returned
        return products;
    }


    // Get product by ID
    @Cacheable(key = "#productId")
    public Optional<Product> getProductById(Long productId) {
        System.out.println("Attempting to fetch product with ID: " + productId);
        Optional<Product> product = productRepository.findById(productId);
        if (product.isPresent()) {
            System.out.println("Product found: " + product.get().getName());
            // Verify category is not null
            if (product.get().getCategory() == null) {
                System.err.println("WARNING: Product with ID " + productId + " has null category!");
            }
            return product;
        } else {
            System.err.println("ERROR: Product with ID " + productId + " not found in database");
            return Optional.empty();
        }
    }

    // Update product
    @Caching(
    		put = {
    				@CachePut(key = "#result.productId")
    		},
    		evict = {
    				@CacheEvict(key = "'allproducts'")
    		}
    		
    		)
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
    @Caching(
    		
    		evict = {
    				@CacheEvict(key = "#productId"),
    				@CacheEvict(key = "'allproducts'")
    		}
    		
    		)
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

