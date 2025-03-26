import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Tab,
  Nav,
  Form,
  Badge,
  ListGroup,
  Modal,
  Navbar
} from "react-bootstrap";
import {
  FaUser,
  FaShoppingBag,
  FaHeart,
  FaStar,
  FaEnvelope,
  FaEdit,
  FaTrash,
  FaGift,
  FaUserFriends,
  FaHome,
  FaTruck,
  FaExchangeAlt,
  FaComment,
  FaPhone,
  FaMapMarkerAlt
} from "react-icons/fa";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import ContactUsForm from "../components/ContactUsForm";
import GiftCards from "../components/GiftCards";
import InviteFriends from "../components/InviteFriends";

const MyProfile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showEditModal, setShowEditModal] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [editFormData, setEditFormData] = useState({
    rating: 5,
    comment: ''
  });

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        console.log("MyProfile - Fetching user data");
        const storedUser = localStorage.getItem("user");
        
        if (!storedUser) {
          console.log("MyProfile - No stored user data, redirecting to login");
          navigate("/login", { state: { from: "/my-profile" } });
          return;
        }

        let userData;
        try {
          userData = JSON.parse(storedUser);
          console.log("MyProfile - Parsed user data:", userData);
          
          // Validate user data structure
          if (!userData || typeof userData !== 'object') {
            throw new Error("Invalid user data structure");
          }
          
          // Ensure we have required fields
          if (!userData.email) {
            throw new Error("Missing email in user data");
          }
          if (!userData.id && !userData.userId) {
            throw new Error("Missing user ID");
          }
          
          // Normalize the user object structure
          const normalizedUser = {
            id: userData.id || userData.userId,
            userId: userData.id || userData.userId,
            username: userData.username,
            email: userData.email,
            role: userData.role || "USER",
            phone: userData.phone || "",
            address: userData.address || ""
          };
          
          console.log("MyProfile - Normalized user data:", normalizedUser);
          setUser(normalizedUser);
          setEditFormData({
            username: normalizedUser.username || "",
            email: normalizedUser.email || "",
            phone: normalizedUser.phone || "",
            address: normalizedUser.address || ""
          });

          // Fetch user's orders
          if (normalizedUser.id) {
            console.log("MyProfile - Fetching orders for user:", normalizedUser.id);
            const ordersResponse = await axios.get(
              `http://localhost:8080/api/orders/user/${normalizedUser.id}`,
              { withCredentials: true }
            );
            console.log("MyProfile - Orders response:", ordersResponse.data);
            setOrders(ordersResponse.data);
          }

          // Fetch user's wishlist
          if (normalizedUser.id) {
            console.log("MyProfile - Fetching wishlist for user:", normalizedUser.id);
            const wishlistResponse = await axios.get(
              `http://localhost:8080/api/wishlist/user/${normalizedUser.id}`,
              { withCredentials: true }
            );
            console.log("MyProfile - Wishlist response:", wishlistResponse.data);
            setWishlist(wishlistResponse.data);
          }

          // Fetch user's reviews (if available)
          try {
            if (normalizedUser.id) {
              console.log("MyProfile - Fetching reviews for user:", normalizedUser.id);
              const reviewsResponse = await axios.get(
                `http://localhost:8080/api/reviews/user/${normalizedUser.id}`,
                { withCredentials: true }
              );
              console.log("MyProfile - Reviews response:", reviewsResponse.data);
              setReviews(reviewsResponse.data);
            }
          } catch (error) {
            console.log("MyProfile - No reviews endpoint available or no reviews found");
            setReviews([]);
          }
        } catch (parseError) {
          console.error("MyProfile - Error processing user data:", parseError);
          localStorage.removeItem("user");
          navigate("/login", { state: { from: "/my-profile" } });
          return;
        }

        setLoading(false);
      } catch (error) {
        console.error("MyProfile - Error fetching user data:", error);
        setLoading(false);
        if (error.response?.status === 401) {
          navigate("/login", { state: { from: "/my-profile" } });
        }
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleEditProfile = async (e) => {
    e.preventDefault();
    try {
      // Update user profile
      await axios.put(
        `http://localhost:8080/api/users/${user.id}`,
        editFormData,
        { withCredentials: true }
      );

      // Update local storage with new user data
      const updatedUser = { ...user, ...editFormData };
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
    setEditFormData({ ...editFormData, [name]: value });
  };

  const removeFromWishlist = async (productId) => {
    try {
      await axios.delete(
        `http://localhost:8080/api/wishlist/${productId}`,
        { withCredentials: true }
      );
    } catch (error) {
      console.error("Error removing from wishlist:", error);
    }
  };

  const handleEditReview = (review) => {
    setEditingReview(review);
    setEditFormData({
      rating: review.rating,
      comment: review.comment
    });
    setShowEditModal(true);
  };

  const handleUpdateReview = async () => {
    try {
      const response = await axios.put(
        `http://localhost:8080/api/reviews/${editingReview.reviewId}`,
        {
          ...editingReview,
          rating: editFormData.rating,
          comment: editFormData.comment
        },
        { withCredentials: true }
      );

      // Update the reviews list with the edited review
      setReviews(prevReviews => 
        prevReviews.map(review => 
          review.reviewId === editingReview.reviewId ? response.data : review
        )
      );

      setShowEditModal(false);
      setEditingReview(null);
      setEditFormData({ rating: 5, comment: '' });
    } catch (error) {
      console.error('Error updating review:', error);
      alert('Failed to update review. Please try again.');
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      try {
        await axios.delete(
          `http://localhost:8080/api/reviews/${reviewId}`,
          { withCredentials: true }
        );

        // Remove the deleted review from the list
        setReviews(prevReviews => 
          prevReviews.filter(review => review.reviewId !== reviewId)
        );
      } catch (error) {
        console.error('Error deleting review:', error);
        alert('Failed to delete review. Please try again.');
      }
    }
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
    <>
      {/* TOP NAVBAR WITH USER INFO */}
      <Navbar bg="light" expand="md" className="shadow-sm mb-4">
        <Container fluid style={{ maxWidth: "1400px" }}>
          <Navbar.Brand as={Link} to="/" className="fw-bold fs-4">
            My Profile
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="profile-navbar-nav" />
          <Navbar.Collapse id="profile-navbar-nav" className="justify-content-end">
            {user && (
              <div className="d-flex align-items-center">
                {/* Avatar */}
                <div
                  style={{
                    width: "50px",
                    height: "50px",
                    borderRadius: "50%",
                    background: "#4a6eb5",
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "22px",
                    fontWeight: "bold"
                  }}
                >
                  {user?.username?.charAt(0).toUpperCase()}
                </div>
                {/* Username & Email */}
                <div className="ms-3 text-nowrap">
                  <h6 className="mb-0 fw-bold">{user.username}</h6>
                  <small className="text-muted">{user.email}</small>
                </div>
                {/* Edit Button */}
                <Button
                  variant="dark"
                  size="sm"
                  className="rounded-pill px-3 ms-4"
                  onClick={() => setShowEditModal(true)}
                >
                  <FaEdit className="me-1" />
                  Edit Profile
                </Button>
              </div>
            )}
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* MAIN PROFILE SECTION */}
      <Container className="pb-5" style={{ maxWidth: "1400px" }}>
        <Tab.Container defaultActiveKey="accountDetails">
          <Row>
            {/* LEFT NAVIGATION COLUMN - UPDATED WITH ICONS */}
            <Col md={3} className="mb-4">
              <Nav className="flex-column">
                {/* PROFILE SECTION */}
                <h6 className="text-uppercase text-muted mb-2 px-3">Profile</h6>
                <Nav.Item>
                  <Nav.Link eventKey="accountDetails" className="py-2 px-3 d-flex align-items-center">
                    <FaUser className="me-2" />
                    Account Details
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="shippingAddresses" className="py-2 px-3 d-flex align-items-center">
                    <FaTruck className="me-2" />
                    Shipping Addresses
                  </Nav.Link>
                </Nav.Item>

                {/* ACCOUNT SECTION */}
                <h6 className="text-uppercase text-muted mt-4 mb-2 px-3">Account</h6>
                <Nav.Item>
                  <Nav.Link
                    eventKey="orderHistory"
                    className="py-2 px-3 d-flex align-items-center"
                  >
                    <FaShoppingBag className="me-2" />
                    Order History
                    {orders.length > 0 && (
                      <Badge bg="dark" className="ms-auto">
                        {orders.length}
                      </Badge>
                    )}
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="returnsRefunds" className="py-2 px-3 d-flex align-items-center">
                    <FaExchangeAlt className="me-2" />
                    Returns &amp; Refunds
                  </Nav.Link>
                </Nav.Item>

                {/* ACTIVITIES SECTION */}
                <h6 className="text-uppercase text-muted mt-4 mb-2 px-3">Activities</h6>
                <Nav.Item>
                  <Nav.Link
                    eventKey="wishlist"
                    className="py-2 px-3 d-flex align-items-center"
                  >
                    <FaHeart className="me-2" />
                    My Wishlist
                    {wishlist.length > 0 && (
                      <Badge bg="dark" className="ms-auto">
                        {wishlist.length}
                      </Badge>
                    )}
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link
                    eventKey="reviews"
                    className="py-2 px-3 d-flex align-items-center"
                  >
                    <FaStar className="me-2" />
                    My Reviews
                    {reviews.length > 0 && (
                      <Badge bg="dark" className="ms-auto">
                        {reviews.length}
                      </Badge>
                    )}
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="contactUs" className="py-2 px-3 d-flex align-items-center">
                    <FaPhone className="me-2" />
                    Contact Us
                  </Nav.Link>
                </Nav.Item>

                {/* REWARDS SECTION */}
                <h6 className="text-uppercase text-muted mt-4 mb-2 px-3">Rewards</h6>
                <Nav.Item>
                  <Nav.Link eventKey="giftCards" className="py-2 px-3 d-flex align-items-center">
                    <FaGift className="me-2" />
                    Gift Cards
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="inviteFriends" className="py-2 px-3 d-flex align-items-center">
                    <FaUserFriends className="me-2" />
                    Invite Friends
                  </Nav.Link>
                </Nav.Item>
              </Nav>
            </Col>

            {/* RIGHT CONTENT COLUMN */}
            <Col md={9}>
              <Tab.Content>
                {/* ACCOUNT DETAILS TAB */}
                <Tab.Pane eventKey="accountDetails">
                  <h4 className="mb-4 fw-bold text-dark">Account Details</h4>
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
                        <p className="fw-bold mb-0">
                          {user?.phone || "Not provided"}
                        </p>
                      </div>
                    </Col>
                    <Col md={6}>
                      <div className="bg-light p-3 rounded-2">
                        <p className="text-muted mb-1 small">Address</p>
                        <p className="fw-bold mb-0">
                          {user?.address || "Not provided"}
                        </p>
                      </div>
                    </Col>
                  </Row>
                </Tab.Pane>

                {/* SHIPPING ADDRESSES */}
                <Tab.Pane eventKey="shippingAddresses">
                  <h4 className="mb-4 fw-bold text-dark">Shipping Addresses</h4>
                  <p className="text-muted">
                    Here you can manage your saved shipping addresses. (Placeholder)
                  </p>
                </Tab.Pane>

                {/* ORDER HISTORY TAB */}
                <Tab.Pane eventKey="orderHistory">
                  <h4 className="mb-4 fw-bold text-dark">Order History</h4>
                  {orders.length > 0 ? (
                    <ListGroup variant="flush" className="rounded-3">
                      {orders.map((order) => (
                        <ListGroup.Item
                          key={order.orderId}
                          className="mb-3 border rounded-2"
                        >
                          <Row className="align-items-center">
                            <Col>
                              <div className="d-flex align-items-center">
                                <div>
                                  <p className="text-muted mb-1 small">Order ID</p>
                                  <p className="fw-bold mb-0">#{order.orderId}</p>
                                </div>
                              </div>
                            </Col>
                            <Col>
                              <p className="text-muted mb-1 small">Date</p>
                              <p className="fw-bold mb-0">
                                {new Date(order.orderDate).toLocaleDateString()}
                              </p>
                            </Col>
                            <Col>
                              <p className="text-muted mb-1 small">Total</p>
                              <p className="fw-bold text-success mb-0">
                                ${order.totalAmount}
                              </p>
                            </Col>
                            <Col className="text-end">
                              <Badge
                                className="rounded-pill px-3 py-2"
                                bg={
                                  order.status === "PENDING"
                                    ? "secondary"
                                    : order.status === "PROCESSING"
                                      ? "warning"
                                      : "success"
                                }
                              >
                                {order.status}
                              </Badge>
                              <div className="mt-2">
                                <Link
                                  to={`/orders/${order.orderId}`}
                                  className="btn btn-sm btn-link text-dark text-decoration-none"
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
                      <p className="text-muted">
                        You haven't placed any orders yet.
                      </p>
                      <Link
                        to="/"
                        className="btn btn-dark mt-2 rounded-pill px-4"
                      >
                        Start Shopping
                      </Link>
                    </div>
                  )}
                </Tab.Pane>

                {/* RETURNS & REFUNDS */}
                <Tab.Pane eventKey="returnsRefunds">
                  <h4 className="mb-4 fw-bold text-dark">Returns &amp; Refunds</h4>
                  <p className="text-muted">
                    Information about returns and refunds. (Placeholder)
                  </p>
                </Tab.Pane>

                {/* GIFT CARDS */}
                <Tab.Pane eventKey="giftCards">
                  <GiftCards />
                </Tab.Pane>

                {/* INVITE FRIENDS */}
                <Tab.Pane eventKey="inviteFriends">
                  <InviteFriends />
                </Tab.Pane>

                {/* WISHLIST TAB */}
                <Tab.Pane eventKey="wishlist">
                  <h4 className="mb-4 fw-bold text-dark">My Wishlist</h4>
                  {wishlist.length > 0 ? (
                    <Row xs={1} md={2} lg={3} className="g-4">
                      {wishlist.map((item) => {
                        const product = item.product || item;
                        const productId = product.productId || product.id;
                        const imageUrl = product.imageUrl || "https://via.placeholder.com/150";
                        const name = product.name || "Product";
                        const price = product.price || 0;

                        return (
                          <Col key={item.id || productId}>
                            <Card className="h-100 shadow-sm border-0 rounded-3 overflow-hidden">
                              <Card.Img
                                variant="top"
                                src={imageUrl}
                                alt={name}
                                style={{ height: "200px", objectFit: "cover" }}
                                className="bg-light"
                              />
                              <Card.Body className="p-3">
                                <Card.Title className="fs-6 fw-bold mb-2">
                                  {name}
                                </Card.Title>
                                <Card.Text className="text-dark fw-bold fs-5 mb-3">
                                  ${price}
                                </Card.Text>
                                <div className="d-flex justify-content-between align-items-center">
                                  <Link
                                    to={`/product/${productId}`}
                                    className="btn btn-sm btn-dark rounded-pill px-3"
                                  >
                                    View Product
                                  </Link>
                                  <Button
                                    variant="link"
                                    className="text-danger p-0"
                                    onClick={() => {
                                      removeFromWishlist(productId);
                                      setWishlist(wishlist.filter(w =>
                                        (w.product?.productId || w.product?.id || w.productId || w.id) !== productId
                                      ));
                                    }}
                                  >
                                    <FaTrash />
                                  </Button>
                                </div>
                              </Card.Body>
                            </Card>
                          </Col>
                        );
                      })}
                    </Row>
                  ) : (
                    <div className="text-center py-5">
                      <FaHeart size={40} className="text-muted mb-3" />
                      <h5 className="fw-bold">Your wishlist is empty</h5>
                      <p className="text-muted">
                        Save items you like to your wishlist.
                      </p>
                      <Link
                        to="/"
                        className="btn btn-dark mt-2 rounded-pill px-4"
                      >
                        Browse Products
                      </Link>
                    </div>
                  )}
                </Tab.Pane>

                {/* REVIEWS TAB */}
                <Tab.Pane eventKey="reviews">
                  <h4 className="mb-4 fw-bold text-dark">My Reviews</h4>
                  {reviews.length > 0 ? (
                    <ListGroup variant="flush" className="rounded-3">
                      {reviews.map((review) => (
                        <ListGroup.Item
                          key={review.reviewId}
                          className="mb-3 border rounded-3 p-4 hover-shadow"
                        >
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <div>
                              <h6 className="mb-1 fw-bold">
                                {review.product.name}
                              </h6>
                              <div className="d-flex align-items-center">
                                {[...Array(5)].map((_, i) => (
                                  <FaStar
                                    key={i}
                                    className={`me-1 ${
                                      i < review.rating
                                        ? "text-warning"
                                        : "text-muted"
                                    }`}
                                    style={{ fontSize: "1.2rem" }}
                                  />
                                ))}
                                <span className="ms-2 text-muted small">
                                  ({review.rating}/5)
                                </span>
                              </div>
                            </div>
                            <div className="d-flex gap-2">
                              <Button
                                variant="outline-dark"
                                size="sm"
                                className="rounded-pill px-3"
                                onClick={() => handleEditReview(review)}
                              >
                                <FaEdit className="me-1" /> Edit
                              </Button>
                              <Button
                                variant="outline-danger"
                                size="sm"
                                className="rounded-pill px-3"
                                onClick={() => handleDeleteReview(review.reviewId)}
                              >
                                <FaTrash />
                              </Button>
                            </div>
                          </div>
                          <p className="mb-1 text-muted">{review.comment}</p>
                          <small className="text-muted">
                            Posted on{" "}
                            {new Date(review.createdAt).toLocaleDateString()}
                          </small>
                        </ListGroup.Item>
                      ))}
                    </ListGroup>
                  ) : (
                    <div className="text-center py-5">
                      <FaStar size={40} className="text-muted mb-3" />
                      <h5 className="fw-bold">No reviews yet</h5>
                      <p className="text-muted">
                        You haven't written any reviews yet.
                      </p>
                      <Link
                        to="/"
                        className="btn btn-dark mt-2 rounded-pill px-4"
                      >
                        Shop Products
                      </Link>
                    </div>
                  )}
                </Tab.Pane>

                {/* CONTACT US TAB */}
                <Tab.Pane eventKey="contactUs">
                  <h4 className="mb-4 fw-bold text-dark">Contact Us</h4>
                  <ContactUsForm />
                </Tab.Pane>
              </Tab.Content>
            </Col>
          </Row>
        </Tab.Container>

        {/* Edit Review Modal */}
        <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Review</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Rating</Form.Label>
                <Form.Select
                  value={editFormData.rating}
                  onChange={(e) => setEditFormData(prev => ({
                    ...prev,
                    rating: parseInt(e.target.value)
                  }))}
                >
                  {[5, 4, 3, 2, 1].map(num => (
                    <option key={num} value={num}>{num} Stars</option>
                  ))}
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Comment</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={editFormData.comment}
                  onChange={(e) => setEditFormData(prev => ({
                    ...prev,
                    comment: e.target.value
                  }))}
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowEditModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleUpdateReview}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </>
  );
};

export default MyProfile;