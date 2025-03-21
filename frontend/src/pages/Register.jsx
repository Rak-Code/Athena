import React, { useState, useContext } from "react";
import { Container, Form, Button, Card } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";


const Register = () => {
  const { registerUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await registerUser(formData);
    navigate("/login");
  };

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "90vh" }}>
      <Card className="p-4 shadow-sm w-100" style={{ maxWidth: "400px", backgroundColor: "#f8f9fa" }}>
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
          Already have an account? <Link to="/login" className="text-dark fw-bold text-decoration-none">Login</Link>
        </p>
      </Card>
    </Container>
  );
};

export default Register;
