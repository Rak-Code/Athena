import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import axios from "axios";

const Register = ({ handleCloseModal, setShowRegister }) => {
  const [formData, setFormData] = useState({
    name: "", // This will map to 'username' in the backend
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form data
    if (!formData.name.trim()) {
      alert("Username is required");
      return;
    }
    if (!formData.email.trim()) {
      alert("Email is required");
      return;
    }
    if (!formData.password.trim()) {
      alert("Password is required");
      return;
    }

    // Map frontend data to backend schema
    const userData = {
      username: formData.name.trim(),
      email: formData.email.trim(),
      password: formData.password,  // Don't trim password as it might contain intentional spaces
      role: "USER"
    };

    console.log("Sending registration data:", { ...userData, password: '***' });

    try {
      // Send POST request to the backend
      const response = await axios.post(
        "http://localhost:8080/api/users/register",
        JSON.stringify(userData),  // Explicitly stringify the data
        {
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
          }
        }
      );

      console.log("Registration successful:", response.data);
      alert("Registration successful! Please login.");
      handleCloseModal();
    } catch (error) {
      console.error("Registration failed:", error);
      
      // Handle different types of errors
      if (error.response) {
        // Log the full error response for debugging
        console.error("Error response:", error.response);
        const errorMessage = error.response.data.message || "Registration failed. Please try again.";
        alert(errorMessage);
      } else if (error.request) {
        alert("Unable to connect to the server. Please check your internet connection.");
      } else {
        alert("An error occurred. Please try again.");
      }
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto', borderRadius: '15px' }}>
      <h2 className="text-center mb-4">Register</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formBasicName" className="mb-3">
          <Form.Label>Full Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter full name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="rounded-pill border-0 shadow-sm"
          />
        </Form.Group>

        <Form.Group controlId="formBasicEmail" className="mb-3">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="rounded-pill border-0 shadow-sm"
          />
        </Form.Group>

        <Form.Group controlId="formBasicPassword" className="mb-3">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="rounded-pill border-0 shadow-sm"
          />
        </Form.Group>

        <Button variant="dark" className="w-100 rounded-pill shadow-sm" type="submit">
          Register
        </Button>
      </Form>

      <p className="text-center mt-3">
        Already have an account?{" "}
        <span
          className="text-dark fw-bold"
          style={{ cursor: "pointer" }}
          onClick={() => setShowRegister(false)}
        >
          Login
        </span>
      </p>
    </div>
  );
};

export default Register;