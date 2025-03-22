import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Tab, Nav, Form, Badge, ListGroup, Image, Modal } from "react-bootstrap";
import { FaUser, FaShoppingBag, FaHeart, FaStar, FaEnvelope, FaEdit, FaTrash } from "react-icons/fa";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const MyProfile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({
    username: "",
    email: "",
    phone: "",
    address: ""
  });

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedUser = localStorage.getItem("user");
        if (!storedUser) {
          navigate("/login");
          return;
        }

        const userData = JSON.parse(storedUser);
        setUser(userData);
        setEditForm({
          username: userData.username || "",
          email: userData.email || "",
          phone: userData.phone || "",
          address: userData.address || ""
        });

        // Fetch user's orders
        if (userData.id) {
          const ordersResponse = await axios.get(
            `http://localhost:8080/api/orders/user/${userData.id}`,
            { withCredentials: true }
          );
          setOrders(ordersResponse.data);
        }

        // Fetch user's wishlist
        if (userData.id) {
          const wishlistResponse = await axios.get(
            `http://localhost:8080/api/wishlist/user/${userData.id}`,
            { withCredentials: true }
          );
          setWishlist(wishlistResponse.data);
        }

        // Fetch user's reviews (if you have this endpoint)
        // This is a placeholder - adjust to your actual API
        if (userData.id) {
          try {
            const reviewsResponse = await axios.get(
              `http://localhost:8080/api/reviews/user/${userData.id}`,
              { withCredentials: true }
            );
            setReviews(reviewsResponse.data);
          } catch (error) {
            console.log("No reviews endpoint available or no reviews found");
            setReviews([]);
          }
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleEditProfile = async (e) => {
    e.preventDefault();
    try {
      // Update user profile
      const response = await axios.put(
        `http://localhost:8080/api/users/${user.id}`,
        editForm,
        { withCredentials: true }
      );

      // Update local storage with new user data
      const updatedUser = { ...user, ...editForm };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
      
      setShowEditModal(false);
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile. Please try again.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm({ ...editForm, [name]: value });
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Loading your profile...</p>
      </Container>
    );
  }

  return (
    <Container className="py-5" style={{ maxWidth: '1600px' }}>
      <h1 className="mb-4 text-center text-dark fw-bold">My Profile</h1>

      <Tab.Container id="profile-tabs" defaultActiveKey="profile">
        <Row>
          <Col md={3}>
            <Card className="mb-4 shadow-lg border-0 rounded-3">
              <Card.Body className="text-center p-4">
                <div
                  className="mx-auto mb-3 bg-dark-gradient"
                  style={{
                    width: "100px",
                    height: "100px",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "42px",
                    fontWeight: "bold",
                    background: 'linear-gradient(135deg, #4a6eb5 0%, #2b4d8a 100%)',
                    color: '#fff',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                  }}
                >
                  {user?.username?.charAt(0).toUpperCase()}
                </div>
                <h5 className="mb-1 fw-bold">{user?.username}</h5>
                <p className="text-muted small mb-3">{user?.email}</p>
                <Button 
                  variant="dark" 
                  size="sm" 
                  className="mb-3 rounded-pill px-4 fw-bold"
                  onClick={() => setShowEditModal(true)}
                >
                  <FaEdit className="me-1" /> Edit Profile
                </Button>
              </Card.Body>
            </Card>

            <Nav variant="pills" className="flex-column mb-4 shadow-sm rounded-3">
              <Nav.Item className="mb-2">
                <Nav.Link eventKey="profile" className="d-flex align-items-center py-3 px-4">
                  <FaUser className="me-2 fs-5" /> 
                  <span className="fw-medium">Profile Details</span>
                </Nav.Link>
              </Nav.Item>
              <Nav.Item className="mb-2">
                <Nav.Link eventKey="orders" className="d-flex align-items-center py-3 px-4">
                  <FaShoppingBag className="me-2 fs-5" /> 
                  <span className="fw-medium">My Orders</span>
                  <Badge bg="dark" className="ms-auto rounded-pill">{orders.length}</Badge>
                </Nav.Link>
              </Nav.Item>
              <Nav.Item className="mb-2">
                <Nav.Link eventKey="wishlist" className="d-flex align-items-center py-3 px-4">
                  <FaHeart className="me-2 fs-5" /> 
                  <span className="fw-medium">My Wishlist</span>
                  <Badge bg="dark" className="ms-auto rounded-pill">{wishlist.length}</Badge>
                </Nav.Link>
              </Nav.Item>
              <Nav.Item className="mb-2">
                <Nav.Link eventKey="reviews" className="d-flex align-items-center py-3 px-4">
                  <FaStar className="me-2 fs-5" /> 
                  <span className="fw-medium">My Reviews</span>
                  <Badge bg="dark" className="ms-auto rounded-pill">{reviews.length}</Badge>
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="contact" className="d-flex align-items-center py-3 px-4">
                  <FaEnvelope className="me-2 fs-5" /> 
                  <span className="fw-medium">Contact Us</span>
                </Nav.Link>
              </Nav.Item>
            </Nav>
          </Col>

          <Col md={9}>
            <Card className="shadow-lg border-0 rounded-3 overflow-hidden">
              <Card.Body className="p-4">
                <Tab.Content>
                  {/* Profile Details Tab */}
                  <Tab.Pane eventKey="profile">
                    <h4 className="mb-4 text-dark fw-bold">Profile Details</h4>
                    <Row className="g-4">
                      <Col md={6}>
                        <div className="bg-light p-3 rounded-2">
                          <p className="text-muted mb-1 small">Full Name</p>
                          <p className="fw-bold mb-0">{user?.username}</p>
                        </div>
                      </Col>
                      <Col md={6}>
                        <div className="bg-light p-3 rounded-2">
                          <p className="text-muted mb-1 small">Email</p>
                          <p className="fw-bold mb-0">{user?.email}</p>
                        </div>
                      </Col>
                      <Col md={6}>
                        <div className="bg-light p-3 rounded-2">
                          <p className="text-muted mb-1 small">Phone</p>
                          <p className="fw-bold mb-0">{user?.phone || "Not provided"}</p>
                        </div>
                      </Col>
                      <Col md={6}>
                        <div className="bg-light p-3 rounded-2">
                          <p className="text-muted mb-1 small">Address</p>
                          <p className="fw-bold mb-0">{user?.address || "Not provided"}</p>
                        </div>
                      </Col>
                    </Row>
                  </Tab.Pane>

                  {/* Orders Tab */}
                  <Tab.Pane eventKey="orders">
                    <h4 className="mb-4 text-dark fw-bold">My Orders</h4>
                    {orders.length > 0 ? (
                      <ListGroup variant="flush" className="rounded-3">
                        {orders.map((order) => (
                          <ListGroup.Item key={order.orderId} className="mb-3 border rounded-3 p-4 hover-shadow">
                            <Row className="align-items-center g-3">
                              <Col md={3}>
                                <p className="text-muted mb-1 small">Order ID</p>
                                <p className="fw-bold text-dark mb-0">#{order.orderId}</p>
                              </Col>
                              <Col md={3}>
                                <p className="text-muted mb-1 small">Date</p>
                                <p className="fw-bold mb-0">
                                  {new Date(order.orderDate).toLocaleDateString()}
                                </p>
                              </Col>
                              <Col md={3}>
                                <p className="text-muted mb-1 small">Total</p>
                                <p className="fw-bold text-success mb-0">${order.totalAmount}</p>
                              </Col>
                              <Col md={3}>
                                <div className="d-flex flex-column align-items-end">
                                  <Badge 
                                    className="rounded-pill px-3 py-2 mb-2"
                                    bg={
                                      order.status === "DELIVERED" ? "success" : 
                                      order.status === "SHIPPED" ? "info" : 
                                      order.status === "PROCESSING" ? "warning" : "secondary"
                                    }
                                  >
                                    {order.status}
                                  </Badge>
                                  <Link 
                                    to={`/order-confirmation/${order.orderId}`} 
                                    className="btn btn-sm btn-outline-dark rounded-pill px-3"
                                  >
                                    View Details
                                  </Link>
                                </div>
                              </Col>
                            </Row>
                          </ListGroup.Item>
                        ))}
                      </ListGroup>
                    ) : (
                      <div className="text-center py-5">
                        <FaShoppingBag size={40} className="text-muted mb-3" />
                        <h5 className="fw-bold">No orders yet</h5>
                        <p className="text-muted">You haven't placed any orders yet.</p>
                        <Link to="/" className="btn btn-dark mt-2 rounded-pill px-4">
                          Start Shopping
                        </Link>
                      </div>
                    )}
                  </Tab.Pane>

                  {/* Wishlist Tab */}
                  <Tab.Pane eventKey="wishlist">
                    <h4 className="mb-4 text-dark fw-bold">My Wishlist</h4>
                    {wishlist.length > 0 ? (
                      <Row xs={1} md={2} lg={3} className="g-4">
                        {wishlist.map((item) => (
                          <Col key={item.id}>
                            <Card className="h-100 shadow-sm border-0 rounded-3 overflow-hidden hover-scale">
                              <Card.Img 
                                variant="top" 
                                src={item.product.imageUrl || "https://via.placeholder.com/150"} 
                                alt={item.product.name}
                                style={{ height: "200px", objectFit: "cover" }}
                                className="bg-light"
                              />
                              <Card.Body className="p-3">
                                <Card.Title className="fs-6 fw-bold mb-2">{item.product.name}</Card.Title>
                                <Card.Text className="text-dark fw-bold fs-5 mb-3">
                                  ${item.product.price}
                                </Card.Text>
                                <div className="d-flex justify-content-between align-items-center">
                                  <Link 
                                    to={`/product/${item.product.productId}`} 
                                    className="btn btn-sm btn-dark rounded-pill px-3"
                                  >
                                    View Product
                                  </Link>
                                  <Button 
                                    variant="link" 
                                    className="text-danger p-0"
                                    onClick={() => {
                                      // Implement remove from wishlist functionality
                                    }}
                                  >
                                    <FaTrash />
                                  </Button>
                                </div>
                              </Card.Body>
                            </Card>
                          </Col>
                        ))}
                      </Row>
                    ) : (
                      <div className="text-center py-5">
                        <FaHeart size={40} className="text-muted mb-3" />
                        <h5 className="fw-bold">Your wishlist is empty</h5>
                        <p className="text-muted">Save items you like to your wishlist.</p>
                        <Link to="/" className="btn btn-dark mt-2 rounded-pill px-4">
                          Browse Products
                        </Link>
                      </div>
                    )}
                  </Tab.Pane>

                  {/* Reviews Tab */}
                  <Tab.Pane eventKey="reviews">
                    <h4 className="mb-4 text-dark fw-bold">My Reviews</h4>
                    {reviews.length > 0 ? (
                      <ListGroup variant="flush" className="rounded-3">
                        {reviews.map((review) => (
                          <ListGroup.Item key={review.id} className="mb-3 border rounded-3 p-4 hover-shadow">
                            <div className="d-flex justify-content-between align-items-center mb-2">
                              <div>
                                <h6 className="mb-1 fw-bold">{review.product.name}</h6>
                                <div className="d-flex align-items-center">
                                  {[...Array(5)].map((_, i) => (
                                    <FaStar 
                                      key={i} 
                                      className={`me-1 ${i < review.rating ? "text-warning" : "text-muted"}`}
                                      style={{ fontSize: '1.2rem' }}
                                    />
                                  ))}
                                  <span className="ms-2 text-muted small">({review.rating}/5)</span>
                                </div>
                              </div>
                              <div className="d-flex gap-2">
                                <Button 
                                  variant="outline-dark" 
                                  size="sm" 
                                  className="rounded-pill px-3"
                                >
                                  <FaEdit className="me-1" /> Edit
                                </Button>
                                <Button 
                                  variant="outline-danger" 
                                  size="sm"
                                  className="rounded-pill px-3"
                                >
                                  <FaTrash />
                                </Button>
                              </div>
                            </div>
                            <p className="mb-1 text-muted">{review.comment}</p>
                            <small className="text-muted">
                              Posted on {new Date(review.createdAt).toLocaleDateString()}
                            </small>
                          </ListGroup.Item>
                        ))}
                      </ListGroup>
                    ) : (
                      <div className="text-center py-5">
                        <FaStar size={40} className="text-muted mb-3" />
                        <h5 className="fw-bold">No reviews yet</h5>
                        <p className="text-muted">You haven't written any reviews yet.</p>
                        <Link to="/" className="btn btn-dark mt-2 rounded-pill px-4">
                          Shop Products
                        </Link>
                      </div>
                    )}
                  </Tab.Pane>

                  {/* Contact Us Tab */}
                  <Tab.Pane eventKey="contact">
                    <h4 className="mb-4 text-dark fw-bold">Contact Us</h4>
                    <Form className="mb-5">
                      <Form.Group className="mb-4">
                        <Form.Label className="fw-medium">Subject</Form.Label>
                        <Form.Control 
                          type="text" 
                          placeholder="Enter subject" 
                          className="rounded-3 py-2"
                        />
                      </Form.Group>
                      <Form.Group className="mb-4">
                        <Form.Label className="fw-medium">Message</Form.Label>
                        <Form.Control 
                          as="textarea" 
                          rows={5} 
                          placeholder="Enter your message" 
                          className="rounded-3 py-2"
                        />
                      </Form.Group>
                      <Button variant="dark" type="submit" className="rounded-pill px-4 fw-medium">
                        Send Message
                      </Button>
                    </Form>

                    <hr className="my-5" />

                    <h5 className="mb-4 text-dark fw-bold">Other Ways to Contact Us</h5>
                    <Row className="g-4">
                      <Col md={6}>
                        <Card className="border-0 shadow-sm h-100 rounded-3">
                          <Card.Body className="p-4">
                            <h6 className="fw-bold mb-3">Customer Support</h6>
                            <div className="d-flex align-items-center mb-2">
                              <FaEnvelope className="me-2 text-dark" />
                              <span>support@athena.com</span>
                            </div>
                            <div className="d-flex align-items-center">
                              <FaStar className="me-2 text-dark" />
                              <span>+1 (123) 456-7890</span>
                            </div>
                          </Card.Body>
                        </Card>
                      </Col>
                      <Col md={6}>
                        <Card className="border-0 shadow-sm h-100 rounded-3">
                          <Card.Body className="p-4">
                            <h6 className="fw-bold mb-3">Business Hours</h6>
                            <div className="mb-2">
                              <p className="mb-1 fw-medium">Monday - Friday</p>
                              <p className="text-muted">9:00 AM - 6:00 PM</p>
                            </div>
                            <div className="mb-2">
                              <p className="mb-1 fw-medium">Saturday</p>
                              <p className="text-muted">10:00 AM - 4:00 PM</p>
                            </div>
                            <div>
                              <p className="mb-1 fw-medium">Sunday</p>
                              <p className="text-muted">Closed</p>
                            </div>
                          </Card.Body>
                        </Card>
                      </Col>
                    </Row>
                  </Tab.Pane>
                </Tab.Content>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Tab.Container>

      {/* Edit Profile Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered>
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title className="fw-bold text-dark">Edit Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body className="pt-0">
          <Form onSubmit={handleEditProfile}>
            <Form.Group className="mb-3">
              <Form.Label className="fw-medium">Username</Form.Label>
              <Form.Control 
                type="text" 
                name="username"
                value={editForm.username}
                onChange={handleInputChange}
                className="rounded-2 py-2"
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="fw-medium">Email</Form.Label>
              <Form.Control 
                type="email" 
                name="email"
                value={editForm.email}
                onChange={handleInputChange}
                className="rounded-2 py-2"
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="fw-medium">Phone</Form.Label>
              <Form.Control 
                type="text" 
                name="phone"
                value={editForm.phone}
                onChange={handleInputChange}
                className="rounded-2 py-2"
              />
            </Form.Group>
            <Form.Group className="mb-4">
              <Form.Label className="fw-medium">Address</Form.Label>
              <Form.Control 
                as="textarea" 
                rows={3}
                name="address"
                value={editForm.address}
                onChange={handleInputChange}
                className="rounded-2 py-2"
              />
            </Form.Group>
            <div className="d-flex justify-content-end gap-2">
              <Button 
                variant="outline-secondary" 
                className="rounded-pill px-4" 
                onClick={() => setShowEditModal(false)}
              >
                Cancel
              </Button>
              <Button 
                variant="dark" 
                type="submit" 
                className="rounded-pill px-4 fw-medium"
              >
                Save Changes
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default MyProfile;