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
      console.log("Sending login request with:", { email: formData.email });
      
      const response = await axios.post("http://localhost:8080/api/users/login", formData, {
        withCredentials: true
      });
      
      // Process the response data
      let userData;
      try {
        // If the response is a string, try to parse it as JSON
        userData = typeof response.data === 'string' ? JSON.parse(response.data) : response.data;
        console.log("Parsed user data:", userData);
      } catch (parseError) {
        console.error("Error parsing response data:", parseError);
        throw new Error("Invalid response format from server");
      }
      
      // Check if the response is an error message
      if (typeof userData === 'string') {
        throw new Error(userData);
      }
      
      // Ensure we have a properly structured user object
      const processedUserData = {
        id: userData.userId,
        userId: userData.userId,
        username: userData.username,
        email: userData.email,
        role: userData.role || "USER"
      };
      
      console.log("Processed user data:", processedUserData);
      
      // Validate the processed data
      if (!processedUserData.userId) {
        console.error("Missing userId in processed data");
        throw new Error("Invalid user data: missing ID");
      }
      if (!processedUserData.email) {
        console.error("Missing email in processed data");
        throw new Error("Invalid user data: missing email");
      }
      
      console.log("Final user data to be stored:", processedUserData);
      
      // Store the processed user data
      localStorage.setItem("user", JSON.stringify(processedUserData));
      
      onLoginSuccess(processedUserData);

      // Get the return URL from location state
      const returnUrl = location.state?.from || '/';
      
      // Redirect based on role
      if (processedUserData.role === "ADMIN" || processedUserData.role === "SUPER_ADMIN") {
        navigate("/admin");
      } else {
        navigate(returnUrl);
      }

      if (handleCloseModal) {
        handleCloseModal();
      }
    } catch (error) {
      console.error("Login error details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        originalError: error
      });
      
      if (error.response?.status === 401) {
        setError("Invalid email or password");
      } else if (error.message.includes("Invalid user data")) {
        setError(error.message);
      } else if (error.message.includes("Invalid response format")) {
        setError("Server response format error. Please try again.");
      } else {
        setError("An error occurred during login. Please try again.");
      }
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