package com.example.backend.repository;

import com.example.backend.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface CategoryRepository extends JpaRepository<Category, Long> {
    // Find category by name (case-insensitive)
    Optional<Category> findByNameIgnoreCase(String name);

    // Find categories whose names contain a given string (case-insensitive)
    List<Category> findByNameContainingIgnoreCase(String name);

    // Fetch categories along with their associated products (using JOIN FETCH)
    @Query("SELECT c FROM Category c LEFT JOIN FETCH c.products WHERE c.categoryId = :categoryId")
    Optional<Category> findByIdWithProducts(@Param("categoryId") Long categoryId);

    // Fetch all categories with their associated products (using JOIN FETCH)
    @Query("SELECT DISTINCT c FROM Category c LEFT JOIN FETCH c.products")
    List<Category> findAllWithProducts();
}