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
    <Container className="py-5">
      <h1 className="mb-4 text-center">My Profile</h1>

      <Tab.Container id="profile-tabs" defaultActiveKey="profile">
        <Row>
          <Col md={3}>
            <Card className="mb-4 shadow-sm">
              <Card.Body className="text-center">
                <div
                  className="mx-auto mb-3"
                  style={{
                    width: "80px",
                    height: "80px",
                    borderRadius: "50%",
                    backgroundColor: "#4a6eb5",
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "32px",
                    fontWeight: "bold",
                  }}
                >
                  {user?.username?.charAt(0).toUpperCase()}
                </div>
                <h5 className="mb-1">{user?.username}</h5>
                <p className="text-muted small mb-3">{user?.email}</p>
                <Button 
                  variant="outline-primary" 
                  size="sm" 
                  className="mb-3"
                  onClick={() => setShowEditModal(true)}
                >
                  <FaEdit className="me-1" /> Edit Profile
                </Button>
              </Card.Body>
            </Card>

            <Nav variant="pills" className="flex-column mb-4 shadow-sm">
              <Nav.Item>
                <Nav.Link eventKey="profile" className="d-flex align-items-center">
                  <FaUser className="me-2" /> Profile Details
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="orders" className="d-flex align-items-center">
                  <FaShoppingBag className="me-2" /> My Orders
                  <Badge bg="primary" className="ms-auto">{orders.length}</Badge>
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="wishlist" className="d-flex align-items-center">
                  <FaHeart className="me-2" /> My Wishlist
                  <Badge bg="primary" className="ms-auto">{wishlist.length}</Badge>
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="reviews" className="d-flex align-items-center">
                  <FaStar className="me-2" /> My Reviews
                  <Badge bg="primary" className="ms-auto">{reviews.length}</Badge>
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="contact" className="d-flex align-items-center">
                  <FaEnvelope className="me-2" /> Contact Us
                </Nav.Link>
              </Nav.Item>
            </Nav>
          </Col>

          <Col md={9}>
            <Card className="shadow-sm">
              <Card.Body>
                <Tab.Content>
                  {/* Profile Details Tab */}
                  <Tab.Pane eventKey="profile">
                    <h4 className="mb-4">Profile Details</h4>
                    <Row>
                      <Col md={6} className="mb-3">
                        <p className="text-muted mb-1">Full Name</p>
                        <p className="fw-bold">{user?.username}</p>
                      </Col>
                      <Col md={6} className="mb-3">
                        <p className="text-muted mb-1">Email</p>
                        <p className="fw-bold">{user?.email}</p>
                      </Col>
                      <Col md={6} className="mb-3">
                        <p className="text-muted mb-1">Phone</p>
                        <p className="fw-bold">{user?.phone || "Not provided"}</p>
                      </Col>
                      <Col md={6} className="mb-3">
                        <p className="text-muted mb-1">Address</p>
                        <p className="fw-bold">{user?.address || "Not provided"}</p>
                      </Col>
                    </Row>
                  </Tab.Pane>

                  {/* Orders Tab */}
                  <Tab.Pane eventKey="orders">
                    <h4 className="mb-4">My Orders</h4>
                    {orders.length > 0 ? (
                      <ListGroup variant="flush">
                        {orders.map((order) => (
                          <ListGroup.Item key={order.orderId} className="mb-3 border rounded p-3">
                            <Row>
                              <Col md={3}>
                                <p className="text-muted mb-1">Order ID</p>
                                <p className="fw-bold">#{order.orderId}</p>
                              </Col>
                              <Col md={3}>
                                <p className="text-muted mb-1">Date</p>
                                <p className="fw-bold">
                                  {new Date(order.orderDate).toLocaleDateString()}
                                </p>
                              </Col>
                              <Col md={3}>
                                <p className="text-muted mb-1">Total</p>
                                <p className="fw-bold">${order.totalAmount}</p>
                              </Col>
                              <Col md={3}>
                                <p className="text-muted mb-1">Status</p>
                                <Badge 
                                  bg={
                                    order.status === "DELIVERED" ? "success" : 
                                    order.status === "SHIPPED" ? "info" : 
                                    order.status === "PROCESSING" ? "warning" : "secondary"
                                  }
                                >
                                  {order.status}
                                </Badge>
                                <div className="mt-2">
                                  <Link 
                                    to={`/order-confirmation/${order.orderId}`} 
                                    className="btn btn-sm btn-outline-primary"
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
                        <h5>No orders yet</h5>
                        <p className="text-muted">You haven't placed any orders yet.</p>
                        <Link to="/" className="btn btn-primary mt-2">
                          Start Shopping
                        </Link>
                      </div>
                    )}
                  </Tab.Pane>

                  {/* Wishlist Tab */}
                  <Tab.Pane eventKey="wishlist">
                    <h4 className="mb-4">My Wishlist</h4>
                    {wishlist.length > 0 ? (
                      <Row xs={1} md={2} lg={3} className="g-4">
                        {wishlist.map((item) => (
                          <Col key={item.id}>
                            <Card className="h-100 shadow-sm">
                              <Card.Img 
                                variant="top" 
                                src={item.product.imageUrl || "https://via.placeholder.com/150"} 
                                alt={item.product.name}
                                style={{ height: "180px", objectFit: "cover" }}
                              />
                              <Card.Body>
                                <Card.Title className="fs-6">{item.product.name}</Card.Title>
                                <Card.Text className="text-primary fw-bold">
                                  ${item.product.price}
                                </Card.Text>
                                <div className="d-flex justify-content-between">
                                  <Link 
                                    to={`/product/${item.product.productId}`} 
                                    className="btn btn-sm btn-outline-primary"
                                  >
                                    View Product
                                  </Link>
                                  <Button 
                                    variant="outline-danger" 
                                    size="sm"
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
                        <h5>Your wishlist is empty</h5>
                        <p className="text-muted">Save items you like to your wishlist.</p>
                        <Link to="/" className="btn btn-primary mt-2">
                          Browse Products
                        </Link>
                      </div>
                    )}
                  </Tab.Pane>

                  {/* Reviews Tab */}
                  <Tab.Pane eventKey="reviews">
                    <h4 className="mb-4">My Reviews</h4>
                    {reviews.length > 0 ? (
                      <ListGroup variant="flush">
                        {reviews.map((review) => (
                          <ListGroup.Item key={review.id} className="mb-3 border rounded p-3">
                            <div className="d-flex justify-content-between align-items-center mb-2">
                              <div>
                                <h6 className="mb-1">{review.product.name}</h6>
                                <div>
                                  {[...Array(5)].map((_, i) => (
                                    <FaStar 
                                      key={i} 
                                      className={i < review.rating ? "text-warning" : "text-muted"}
                                    />
                                  ))}
                                </div>
                              </div>
                              <div>
                                <Button 
                                  variant="outline-primary" 
                                  size="sm" 
                                  className="me-2"
                                >
                                  <FaEdit /> Edit
                                </Button>
                                <Button 
                                  variant="outline-danger" 
                                  size="sm"
                                >
                                  <FaTrash />
                                </Button>
                              </div>
                            </div>
                            <p className="mb-1">{review.comment}</p>
                            <small className="text-muted">
                              Posted on {new Date(review.createdAt).toLocaleDateString()}
                            </small>
                          </ListGroup.Item>
                        ))}
                      </ListGroup>
                    ) : (
                      <div className="text-center py-5">
                        <FaStar size={40} className="text-muted mb-3" />
                        <h5>No reviews yet</h5>
                        <p className="text-muted">You haven't written any reviews yet.</p>
                        <Link to="/" className="btn btn-primary mt-2">
                          Shop Products
                        </Link>
                      </div>
                    )}
                  </Tab.Pane>

                  {/* Contact Us Tab */}
                  <Tab.Pane eventKey="contact">
                    <h4 className="mb-4">Contact Us</h4>
                    <Form>
                      <Form.Group className="mb-3">
                        <Form.Label>Subject</Form.Label>
                        <Form.Control 
                          type="text" 
                          placeholder="Enter subject" 
                        />
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label>Message</Form.Label>
                        <Form.Control 
                          as="textarea" 
                          rows={5} 
                          placeholder="Enter your message" 
                        />
                      </Form.Group>
                      <Button variant="primary" type="submit">
                        Send Message
                      </Button>
                    </Form>

                    <hr className="my-4" />

                    <h5 className="mb-3">Other Ways to Contact Us</h5>
                    <Row>
                      <Col md={6} className="mb-3">
                        <h6>Customer Support</h6>
                        <p className="mb-1">Email: support@athena.com</p>
                        <p className="mb-1">Phone: +1 (123) 456-7890</p>
                      </Col>
                      <Col md={6} className="mb-3">
                        <h6>Business Hours</h6>
                        <p className="mb-1">Monday - Friday: 9AM - 6PM</p>
                        <p className="mb-1">Saturday: 10AM - 4PM</p>
                        <p className="mb-1">Sunday: Closed</p>
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
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleEditProfile}>
            <Form.Group className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control 
                type="text" 
                name="username"
                value={editForm.username}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control 
                type="email" 
                name="email"
                value={editForm.email}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Phone</Form.Label>
              <Form.Control 
                type="text" 
                name="phone"
                value={editForm.phone}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Address</Form.Label>
              <Form.Control 
                as="textarea" 
                rows={3}
                name="address"
                value={editForm.address}
                onChange={handleInputChange}
              />
            </Form.Group>
            <div className="d-flex justify-content-end">
              <Button variant="secondary" className="me-2" onClick={() => setShowEditModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" type="submit">
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