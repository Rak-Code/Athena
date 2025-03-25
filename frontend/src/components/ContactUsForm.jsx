import React from "react";
import { Form, Card, Row, Col, Button } from "react-bootstrap";
import { FaEnvelope, FaStar } from "react-icons/fa";

const ContactUsForm = () => {
  return (
    <>
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
        <Button
          variant="dark"
          type="submit"
          className="rounded-pill px-4 fw-medium"
        >
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

      {/* Map Section */}
      <div className="mt-5">
        <h5 className="mb-3 text-dark fw-bold">Our Location</h5>
        <div className="ratio ratio-16x9 rounded-3 overflow-hidden shadow-sm">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.215256024346!2d-73.9878449240176!3d40.74844047138962!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259a9b3117469%3A0xd134e199a405a163!2sEmpire%20State%20Building!5e0!3m2!1sen!2sus!4v1711374090761!5m2!1sen!2sus"
            width="600"
            height="450"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Company Location"
          ></iframe>
        </div>
      </div>
    </>
  );
};

export default ContactUsForm;