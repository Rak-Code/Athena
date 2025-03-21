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

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchTerm(searchInput);
  };

  const handleCloseModal = () => {
    setShowModal(false);
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

              {/* Open Login Modal on Click */}
              <Nav.Link onClick={() => setShowModal(true)} className="d-flex align-items-center" style={{ cursor: "pointer" }}>
                <FaUser size={20} className="me-1" /> Login / Register
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Modal for Login */}
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
        </Modal.Header>
        <Modal.Body className="p-3" style={{ padding: '20px', borderRadius: '15px' }}>
          <Login handleClose={handleCloseModal} />
        </Modal.Body>
      </Modal>
    </>
  );
};

export default NavigationBar;