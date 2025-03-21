import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { FaFacebook, FaInstagram, FaTwitter, FaEnvelope, FaPhone } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";

const Footer = () => {
  return (
    <footer className="bg-light bg-opacity-90 py-2 border-top">
      <Container fluid="lg">
        <Row className="align-items-center py-2">
          <Col md={3} className="text-center text-md-start">
            <span className="fw-bold">Athena</span>
          </Col>
          
          <Col md={6} className="text-center">
            <div className="d-flex justify-content-center gap-4">
              <a href="#" className="text-dark">
                <FaFacebook size={16} />
              </a>
              <a href="#" className="text-dark">
                <FaInstagram size={16} />
              </a>
              <a href="#" className="text-dark">
                <FaTwitter size={16} />
              </a>
            </div>
            <div className="mt-2">
              <span className="text-muted small">© 2025 Athena. All Rights Reserved.</span>
            </div>
          </Col>
          
          <Col md={3} className="text-center text-md-end">
            <div className="d-flex flex-column align-items-center align-items-md-end">
              <a href="mailto:contact@athena.com" className="text-dark text-decoration-none small">
                <FaEnvelope size={12} className="me-1" /> contact@athena.com
              </a>
              {/* <a href="tel:+18001234567" className="text-dark text-decoration-none small">
                <FaPhone size={11} className="me-1" /> (800) 123-4567
              </a> */}
            </div>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;