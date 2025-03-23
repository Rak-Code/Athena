import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import Register from "./Register";

const Login = ({ handleCloseModal, setShowRegister, showRegister, onLoginSuccess }) => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState(""); // State for error messages
  const navigate = useNavigate(); // Hook for navigation

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Send login request to the backend
      const response = await axios.post("http://localhost:8080/api/users/login", formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("Login successful, raw response:", response.data);
      
      // Process the user data to ensure it has the expected structure
      const userData = response.data;
      
      // Store the authentication token in localStorage if it exists
      if (userData.token) {
        localStorage.setItem('token', userData.token);
        console.log('Token stored in localStorage');
      }
      
      // Ensure the user object has both id and userId properties
      const processedUserData = {
        ...userData,
        // If the backend returns userId but not id, add id property
        id: userData.id || userData.userId,
        // If the backend returns id but not userId, add userId property
        userId: userData.userId || userData.id
      };
      
      console.log("Processed user data:", processedUserData);
      console.log("User ID properties - id:", processedUserData.id, "userId:", processedUserData.userId);
      
      // Double check that we have valid ID properties
      if (!processedUserData.id && !processedUserData.userId) {
        console.error("Warning: User data is missing both id and userId properties!");
        // Try to extract ID from other properties if available
        if (userData.user && (userData.user.id || userData.user.userId)) {
          processedUserData.id = userData.user.id || userData.user.userId;
          processedUserData.userId = userData.user.userId || userData.user.id;
          console.log("Extracted ID from nested user object:", processedUserData.id);
        }
      }
      
      onLoginSuccess(processedUserData); // Pass processed user data to the parent component

      // Redirect based on role
      if (processedUserData.role === "ADMIN" || processedUserData.role === "SUPER_ADMIN") {
        navigate("/admin"); // Redirect to admin panel
      } else {
        navigate("/"); // Redirect to home page for regular users
      }

      handleCloseModal(); // Close the modal after successful login
    } catch (error) {
      console.error("Login failed:", error.response?.data || error.message);
      setError("Invalid email or password. Please try again."); // Set error message
    }
  };

  return (
    <>
      {!showRegister ? (
        <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto' }}>
          <h2 className="text-center mb-4">Login</h2>
          {error && <div className="alert alert-danger">{error}</div>} {/* Display error message */}
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formBasicEmail" className="mb-3">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="rounded-pill border-0 shadow-sm"
                required
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
                required
              />
            </Form.Group>

            <Button variant="dark" className="w-100 rounded-pill shadow-sm" type="submit">
              Login
            </Button>
          </Form>

          <p className="text-center mt-3">
            Don't have an account?{" "}
            <span className="text-dark fw-bold" style={{ cursor: "pointer" }} onClick={() => setShowRegister(true)}>
              Register
            </span>
          </p>
        </div>
      ) : (
        <Register handleCloseModal={handleCloseModal} setShowRegister={setShowRegister} />
      )}
    </>
  );
};

export default Login;