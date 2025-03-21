import React, { useState } from "react";
import { Form, Button } from "react-bootstrap"; // Removed Modal
import Register from "./Register"; // Import Register component

const Login = ({ handleCloseModal }) => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showRegister, setShowRegister] = useState(false); // State to toggle Register modal

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    alert("Login functionality here!");
    handleCloseModal(); // Close modal after login
  };

  return (
    <>
      {!showRegister ? (
        <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto' }}>
          <Form onSubmit={handleSubmit}>
            <h2 className="text-center mb-4">Login</h2>
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