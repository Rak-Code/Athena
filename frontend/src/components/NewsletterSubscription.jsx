import React, { useState } from 'react';
import { Form, Button, Alert, Container, Row, Col } from 'react-bootstrap';

const NewsletterSubscription = () => {
  const [email, setEmail] = useState('');
  const [subscriptionStatus, setSubscriptionStatus] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!emailRegex.test(email)) {
      setSubscriptionStatus('error');
      return;
    }

    // Here you would typically add logic to send the email to your backend
    // For now, we'll simulate a successful subscription
    setSubscriptionStatus('success');
    
    // Reset email input after submission
    setEmail('');
  };

  return (
    <Container className="my-5 newsletter-subscription">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <div className="bg-light p-4 rounded shadow-sm text-center">
            <h3 className="mb-4">Stay Updated with Our Newsletter</h3>
            <p className="text-muted mb-4">
              Subscribe to get the latest trends, promotions, and exclusive offers!
            </p>
            
            <Form onSubmit={handleSubmit}>
              <Row className="g-2">
                <Col xs={8}>
                  <Form.Control 
                    type="email" 
                    placeholder="Enter your email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </Col>
                <Col xs={4}>
                  <Button variant="dark" type="submit" className="w-100">
                    Subscribe
                  </Button>
                </Col>
              </Row>
            </Form>

            {subscriptionStatus === 'success' && (
              <Alert variant="success" className="mt-3">
                Thank you for subscribing! You'll receive our latest updates soon.
              </Alert>
            )}
            
            {subscriptionStatus === 'error' && (
              <Alert variant="danger" className="mt-3">
                Please enter a valid email address.
              </Alert>
            )}
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default NewsletterSubscription;