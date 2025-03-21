package com.example.backend.dto;

public class LoginRequest {
  // Optional: Use either username or email
    private String email;    // Optional: Use either username or email
    private String password;

    // Getters and Setters




    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
