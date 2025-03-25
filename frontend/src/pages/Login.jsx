import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom"; // Add useLocation
import Register from "./Register";

const Login = ({ handleCloseModal, setShowRegister, showRegister, onLoginSuccess }) => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState(""); // State for error messages
  const navigate = useNavigate(); // Hook for navigation
  const location = useLocation(); // Add location hook

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError("");
      const response = await axios.post("http://localhost:8080/api/users/login", formData, {
        withCredentials: true
      });
      
      // Process the response data
      const userData = response.data;
      console.log("Login response data:", userData);
      
      // Normalize user data structure
      const processedUserData = {
        ...userData,
        id: userData.id || userData.userId || (userData.user ? userData.user.id : null),
        userId: userData.userId || userData.id || (userData.user ? userData.user.userId : null),
        role: userData.role || userData.userRole || (userData.user ? userData.user.role : null) || "USER"
      };
      
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
      
      console.log("Final processed user data:", processedUserData);
      onLoginSuccess(processedUserData); // Pass processed user data to the parent component

      // Get the return URL from location state
      const returnUrl = location.state?.from || '/';
      console.log("Return URL from location state:", returnUrl);
      
      // Redirect based on role or return URL
      if (processedUserData.role === "ADMIN" || processedUserData.role === "SUPER_ADMIN") {
        console.log("Redirecting to admin dashboard");
        navigate("/admin"); // Redirect to admin panel
      } else {
        console.log("Redirecting to:", returnUrl);
        navigate(returnUrl); // Redirect to return URL or home page
      }

      if (handleCloseModal) {
        handleCloseModal();
      }
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