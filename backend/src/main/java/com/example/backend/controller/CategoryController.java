package com.example.backend.controller;

import com.example.backend.model.Category;
import com.example.backend.services.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
@CrossOrigin(origins = "http://localhost:5173")
public class CategoryController {

    @Autowired
    private CategoryService categoryService;

    // Create a new category
    @PostMapping
    public ResponseEntity<Category> createCategory(@RequestBody Category category) {
        Category createdCategory = categoryService.createCategory(category);
        return ResponseEntity.ok(createdCategory);
    }

    // Get all categories
    @GetMapping
    public ResponseEntity<List<Category>> getAllCategories() {
        List<Category> categories = categoryService.getAllCategories();
        return ResponseEntity.ok(categories);
    }

    // Get category by ID
    @GetMapping("/{categoryId}")
    public ResponseEntity<Category> getCategoryById(@PathVariable Long categoryId) {
        return categoryService.getCategoryById(categoryId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Update category
    @PutMapping("/{categoryId}")
    public ResponseEntity<Category> updateCategory(@PathVariable Long categoryId, @RequestBody Category categoryDetails) {
        Category updatedCategory = categoryService.updateCategory(categoryId, categoryDetails);
        return ResponseEntity.ok(updatedCategory);
    }

    // Delete category
    @DeleteMapping("/{categoryId}")
    public ResponseEntity<Void> deleteCategory(@PathVariable Long categoryId) {
        categoryService.deleteCategory(categoryId);
        return ResponseEntity.noContent().build();
    }

    // Find category by name (case-insensitive)
    @GetMapping("/name/{name}")
    public ResponseEntity<Category> findByNameIgnoreCase(@PathVariable String name) {
        return categoryService.findByNameIgnoreCase(name)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Find categories by name containing a string (case-insensitive)
    @GetMapping("/search/{name}")
    public ResponseEntity<List<Category>> findByNameContainingIgnoreCase(@PathVariable String name) {
        List<Category> categories = categoryService.findByNameContainingIgnoreCase(name);
        return ResponseEntity.ok(categories);
    }

    // Fetch category with products
    @GetMapping("/{categoryId}/with-products")
    public ResponseEntity<Category> findByIdWithProducts(@PathVariable Long categoryId) {
        return categoryService.findByIdWithProducts(categoryId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Fetch all categories with products
    @GetMapping("/with-products")
    public ResponseEntity<List<Category>> findAllWithProducts() {
        List<Category> categories = categoryService.findAllWithProducts();
        return ResponseEntity.ok(categories);
    }
}