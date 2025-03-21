import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { Navbar, Nav, Form, FormControl, Button, Container, Badge, Modal, Dropdown } from "react-bootstrap";
import { FaShoppingCart, FaUser, FaSignOutAlt, FaUserCog, FaTachometerAlt, FaHeart } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import Login from "../pages/Login"; // Import Login Component





const NavigationBar = ({ setSearchTerm, user, onLoginSuccess }) => {
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();
  const [searchInput, setSearchInput] = useState("");
  const [showModal, setShowModal] = useState(false); // State for modal visibility
  const [showRegister, setShowRegister] = useState(false); // State to toggle between Login and Register

  // Debug user object
  useEffect(() => {
    if (user) {
      console.log('NavigationBar - User object:', user);
      console.log('User properties:', Object.keys(user));
    }
  }, [user]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchTerm(searchInput);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setShowRegister(false); // Reset to Login view when modal is closed
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
              <Nav.Link as={NavLink} to="/cart" className="d-flex align-items-center position-relative me-3">
                <FaShoppingCart size={20} className="me-1" />
                {cartCount > 0 && (
                  <Badge pill bg="danger" className="position-absolute top-0 start-100 translate-middle">
                    {cartCount}
                  </Badge>
                )}
                <span className="ms-1">Cart</span>
              </Nav.Link>
              <Nav.Link as={NavLink} to="/wishlist" className="d-flex align-items-center position-relative me-3">
                <FaHeart size={20} className="me-1" />
                {wishlistCount > 0 && (
                  <Badge pill bg="danger" className="position-absolute top-0 start-100 translate-middle">
                    {wishlistCount}
                  </Badge>
                )}
                <span className="ms-1">Wishlist</span>
              </Nav.Link>

              {/* Display user's profile or Login / Register button */}
              {user ? (
                <Dropdown align="end">
                  <Dropdown.Toggle
                    as="div"
                    id="profile-dropdown"
                    className="d-flex align-items-center"
                  >
                    <div className="d-flex align-items-center" style={{ cursor: "pointer" }}>
                      <div
                        style={{
                          width: "38px",
                          height: "38px",
                          borderRadius: "50%",
                          backgroundColor: "#4a6eb5",
                          color: "#fff",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "16px",
                          fontWeight: "bold",
                          boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
                          border: "2px solid #fff"
                        }}
                      >
                        {user.username.charAt(0).toUpperCase()}
                      </div>
                      <span className="ms-2 d-none d-md-inline fw-semibold" style={{ color: "#4a6eb5" }}>
                        {user.username}
                      </span>
                    </div>
                  </Dropdown.Toggle>

                  <Dropdown.Menu
                    className="shadow-lg border-0"
                    style={{
                      marginTop: "0.5rem",
                      borderRadius: "0.5rem",
                      minWidth: "200px"
                    }}
                  >
                    <div className="px-4 py-3 border-bottom">
                      <div className="fw-bold">{user.username}</div>
                      <div className="text-muted small">{user.email}</div>
                    </div>

                    <Dropdown.Item as={NavLink} to="/profile" className="py-2">
                      <div className="d-flex align-items-center">
                        <FaUser className="me-2 text-secondary" />
                        <span>My Profile</span>
                      </div>
                    </Dropdown.Item>

                    {user.role === "ADMIN" && (
                      <Dropdown.Item as={NavLink} to="/admin" className="py-2">
                        <div className="d-flex align-items-center">
                          <FaTachometerAlt className="me-2 text-secondary" />
                          <span>Admin Dashboard</span>
                        </div>
                      </Dropdown.Item>
                    )}

                    <Dropdown.Divider />

                    <Dropdown.Item
                      onClick={() => onLoginSuccess(null)}
                      className="text-danger py-2"
                    >
                      <div className="d-flex align-items-center">
                        <FaSignOutAlt className="me-2" />
                        <span>Logout</span>
                      </div>
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              ) : (
                <Button
                  onClick={() => setShowModal(true)}
                  variant="outline-primary"
                  className="d-flex align-items-center rounded-pill"
                  style={{
                    backgroundColor: "transparent",
                    borderColor: "#4a6eb5",
                    color: "#4a6eb5"
                  }}
                >
                  <FaUser size={16} className="me-2" /> Login / Register
                </Button>
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
            onLoginSuccess={onLoginSuccess} // Pass the callback function
          />
        </Modal.Body>
      </Modal>
    </>
  );
};

export default NavigationBar;