package com.example.backend.repository;

import com.example.backend.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByCategory_CategoryId(Long categoryId); // Find products by category ID
    List<Product> findByNameContainingIgnoreCase(String name);// Search products by name



    @Query("SELECT p FROM Product p WHERE "
            + "(:categoryId IS NULL OR p.category.categoryId = :categoryId) AND "
            + "(:minPrice IS NULL OR p.price >= :minPrice) AND "
            + "(:maxPrice IS NULL OR p.price <= :maxPrice) AND "
            + "(:size IS NULL OR p.size = :size) AND "
            + "(:inStock IS NULL OR (:inStock = true AND p.stockQuantity > 0) OR (:inStock = false AND p.stockQuantity <= 0))")
    List<Product> findByFilters(
            @Param("categoryId") Long categoryId,
            @Param("minPrice") BigDecimal minPrice,
            @Param("maxPrice") BigDecimal maxPrice,
            @Param("size") Product.Size size, // Fully qualified Product.Size
            @Param("inStock") Boolean inStock);
}