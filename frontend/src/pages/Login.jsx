import React, { useState, useContext } from "react";
import { Container, Form, Button, Card } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";


const Login = () => {
  const { loginUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await loginUser(formData);
    if (response.token) {
      alert("Login successful!");
      navigate("/"); // Redirect to home page
    } else {
      alert("Invalid email or password!");
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "90vh" }}>
      <Card className="p-4 shadow-sm w-100" style={{ maxWidth: "400px", backgroundColor: "#f8f9fa" }}>
        <h2 className="text-center mb-4">Login</h2>
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
          Don't have an account? <Link to="/register" className="text-dark fw-bold text-decoration-none">Register</Link>
        </p>
      </Card>
    </Container>
  );
};

export default Login;
