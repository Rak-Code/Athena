package com.example.backend.services;

import com.example.backend.model.Category;
import com.example.backend.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    // Create a new category
    public Category createCategory(Category category) {
        return categoryRepository.save(category);
    }

    // Get all categories
    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    // Get category by ID
    public Optional<Category> getCategoryById(Long categoryId) {
        return categoryRepository.findById(categoryId);
    }

    // Update category
    public Category updateCategory(Long categoryId, Category categoryDetails) {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new RuntimeException("Category not found with id: " + categoryId));
        category.setName(categoryDetails.getName());
        category.setDescription(categoryDetails.getDescription());
        return categoryRepository.save(category);
    }

    // Delete category
    public void deleteCategory(Long categoryId) {
        categoryRepository.deleteById(categoryId);
    }

    // Find category by name (case-insensitive)
    public Optional<Category> findByNameIgnoreCase(String name) {
        return categoryRepository.findByNameIgnoreCase(name);
    }

    // Find categories by name containing a string (case-insensitive)
    public List<Category> findByNameContainingIgnoreCase(String name) {
        return categoryRepository.findByNameContainingIgnoreCase(name);
    }

    // Fetch category with products
    public Optional<Category> findByIdWithProducts(Long categoryId) {
        return categoryRepository.findByIdWithProducts(categoryId);
    }

    // Fetch all categories with products
    public List<Category> findAllWithProducts() {
        return categoryRepository.findAllWithProducts();
    }
}