import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { Navbar, Nav, Form, FormControl, Button, Container, Badge, Modal } from "react-bootstrap";
import { FaShoppingCart, FaUser } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import { useCart } from "../context/CartContext";
import Login from "../pages/Login"; // Import Login Component

const NavigationBar = ({ setSearchTerm }) => {
  const { cartCount } = useCart();
  const [searchInput, setSearchInput] = useState("");
  const [showModal, setShowModal] = useState(false); // State for modal visibility
  const [showRegister, setShowRegister] = useState(false); // State to toggle between Login and Register
  const [user, setUser] = useState(null); // State to track the logged-in user

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchTerm(searchInput);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setShowRegister(false); // Reset to Login view when modal is closed
  };

  const handleLoginSuccess = (userData) => {
    setUser(userData); // Set the logged-in user
    handleCloseModal(); // Close the modal
  };

  return (
    <>
      <Navbar bg="light" expand="lg" className="shadow-sm">
        <Container>
          <Navbar.Brand as={NavLink} to="/" className="fw-bold fs-4">
            Athena
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="navbar-nav" />
          <Navbar.Collapse id="navbar-nav">
            <Nav className="mx-auto">
              <Form className="d-flex position-relative" style={{ width: "500px" }} onSubmit={handleSearch}>
                <FormControl
                  type="search"
                  placeholder="Search..."
                  className="me-2 rounded-pill border-0 shadow-sm"
                  style={{ backgroundColor: "#f8f9fa" }}
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                />
                <Button type="submit" variant="outline-dark" className="rounded-pill">
                  Search
                </Button>
              </Form>
            </Nav>

            <Nav>
              <Nav.Link as={NavLink} to="/cart" className="d-flex align-items-center position-relative">
                <FaShoppingCart size={20} className="me-1" />
                {cartCount > 0 && (
                  <Badge pill bg="danger" className="position-absolute top-0 start-100 translate-middle">
                    {cartCount}
                  </Badge>
                )}
                <span className="ms-1">Cart</span>
              </Nav.Link>

              {/* Display user's first initial or Login / Register button */}
              {user ? (
                <Nav.Link className="d-flex align-items-center" style={{ cursor: "pointer" }}>
                  <div
                    style={{
                      width: "30px",
                      height: "30px",
                      borderRadius: "50%",
                      backgroundColor: "#007bff",
                      color: "#fff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "14px",
                      fontWeight: "bold",
                    }}
                  >
                    {user.username.charAt(0).toUpperCase()} {/* Display first initial */}
                  </div>
                </Nav.Link>
              ) : (
                <Nav.Link onClick={() => setShowModal(true)} className="d-flex align-items-center" style={{ cursor: "pointer" }}>
                  <FaUser size={20} className="me-1" /> Login / Register
                </Nav.Link>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Modal for Login and Register */}
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>{showRegister ? "Register" : "Login"}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-3" style={{ padding: '20px', borderRadius: '15px' }}>
          <Login
            handleCloseModal={handleCloseModal}
            setShowRegister={setShowRegister}
            showRegister={showRegister}
            onLoginSuccess={handleLoginSuccess} // Pass the callback function
          />
        </Modal.Body>
      </Modal>
    </>
  );
};

export default NavigationBar;