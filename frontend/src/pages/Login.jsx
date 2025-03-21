import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import axios from "axios";
import Register from "./Register"; // Import Register component

const Login = ({ handleCloseModal, setShowRegister, showRegister, onLoginSuccess }) => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState(""); // State for error messages

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

      console.log("Login successful:", response.data);
      alert("Login successful!");
      onLoginSuccess(response.data); // Pass user data to the parent component
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