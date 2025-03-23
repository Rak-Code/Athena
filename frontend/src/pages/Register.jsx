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

    // Map frontend data to backend schema
    const userData = {
      username: formData.name, // Map 'name' to 'username'
      email: formData.email,
      password: formData.password,
    };

    try {
      // Send POST request to the backend
      const response = await axios.post("http://localhost:8080/api/users/register", userData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("Registration successful:", response.data);
      alert("Registration successful!");
      handleCloseModal(); // Close the modal after successful registration
    } catch (error) {
      console.error("Registration failed:", error.response?.data || error.message);
      alert("Registration failed. Please try again.");
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