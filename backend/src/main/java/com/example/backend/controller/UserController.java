package com.example.backend.controller;

import com.example.backend.dto.LoginRequest;
import com.example.backend.dto.RegisterRequest;
import com.example.backend.model.User;
import com.example.backend.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;
import java.util.Optional;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {
    
    private static final Logger logger = LoggerFactory.getLogger(UserController.class);

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public ResponseEntity<?> createUser(@RequestBody RegisterRequest registerRequest) {
        try {
            // Validate required fields
            if (registerRequest.getUsername() == null || registerRequest.getUsername().trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("message", "Username is required"));
            }
            if (registerRequest.getEmail() == null || registerRequest.getEmail().trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("message", "Email is required"));
            }
            if (registerRequest.getPassword() == null || registerRequest.getPassword().trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("message", "Password is required"));
            }

            // Check if username already exists
            if (userService.findByUsername(registerRequest.getUsername()).isPresent()) {
                return ResponseEntity.badRequest().body(Map.of("message", "Username already exists"));
            }

            // Check if email already exists
            if (userService.findByEmail(registerRequest.getEmail()).isPresent()) {
                return ResponseEntity.badRequest().body(Map.of("message", "Email already exists"));
            }

            // Create new user
            User user = new User();
            user.setUsername(registerRequest.getUsername().trim());
            user.setEmail(registerRequest.getEmail().trim());
            user.setPassword(registerRequest.getPassword().trim());
            user.setRole(User.Role.USER);

            User createdUser = userService.createUser(user);
            
            // Create a response object without sensitive information
            Map<String, Object> response = new HashMap<>();
            response.put("userId", createdUser.getUserId());
            response.put("username", createdUser.getUsername());
            response.put("email", createdUser.getEmail());
            response.put("role", createdUser.getRole().toString());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Error during user registration: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("message", "Registration failed: " + e.getMessage()));
        }
    }

    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    @GetMapping("/{userId}")
    public ResponseEntity<User> getUserById(@PathVariable Long userId) {
        return userService.getUserById(userId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{userId}")
    public ResponseEntity<User> updateUser(@PathVariable Long userId,
                                           @RequestBody User userDetails) {
        User updatedUser = userService.updateUser(userId, userDetails);
        return ResponseEntity.ok(updatedUser);
    }

    @DeleteMapping("/{userId}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long userId) {
        userService.deleteUser(userId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/username/{username}")
    public ResponseEntity<User> findByUsername(@PathVariable String username) {
        return userService.findByUsername(username)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/email/{email}")
    public ResponseEntity<User> findByEmail(@PathVariable String email) {
        return userService.findByEmail(email)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody LoginRequest loginRequest) {
        try {
            logger.debug("Login attempt for email: {}", loginRequest.getEmail());
            
            // Find user by email
            Optional<User> userOptional = userService.findByEmail(loginRequest.getEmail());
            
            if (userOptional.isPresent()) {
                User user = userOptional.get();
                // Verify password using BCrypt
                if (userService.verifyPassword(loginRequest.getPassword(), user.getPassword())) {
                    // Create a simplified response object
                    Map<String, Object> response = new HashMap<>();
                    response.put("userId", user.getUserId());
                    response.put("username", user.getUsername());
                    response.put("email", user.getEmail());
                    response.put("role", user.getRole().toString());
                    
                    logger.debug("Login successful for user: {}", user.getEmail());
                    return ResponseEntity.ok(response);
                }
            }
            
            logger.debug("Login failed: Invalid credentials for email: {}", loginRequest.getEmail());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("message", "Invalid credentials"));
                
        } catch (Exception e) {
            logger.error("Login error for email {}: {}", loginRequest.getEmail(), e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("message", "An error occurred during login"));
        }
    }
}