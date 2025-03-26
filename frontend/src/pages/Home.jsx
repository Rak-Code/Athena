import React, { useState } from "react";
import { Container, Nav } from "react-bootstrap";

// Import all necessary components
import CarouselComponent from "../components/CarouselComponent";
import ProductList from "../components/ProductList";
import Footer from "../components/Footer";
import NewsletterSubscription from "../components/NewsletterSubscription";
import DiscountBanner from "../components/DiscountBanner";
// New Chatbot Button Import
import ChatbotButton from "../components/ChatBotButton";

const Home = ({ searchTerm }) => {
  const [activeTab, setActiveTab] = useState("home");
  const [categoryId, setCategoryId] = useState(null);

  const handleTabSelect = (tab) => {
    setActiveTab(tab);
    
    // Set categoryId based on selected tab
    switch(tab) {
      case "mens":
        setCategoryId(1);
        break;
      case "womens":
        setCategoryId(2);
        break;
      case "kids":
        setCategoryId(3);
        break;
      default:
        setCategoryId(null);
        break;
    }
  };

  return (
    <Container className="mt-4 position-relative">
      <DiscountBanner />
      {/* Show Carousel only when there is no search */}
      {!searchTerm && <CarouselComponent />}

      {/* Show Search Header when search results are displayed */}
      {searchTerm ? (
        <>
          <h2 className="text-center my-4 fw-bold">Search Results</h2>
          <ProductList searchTerm={searchTerm} />
        </>
      ) : (
        <>
          <h2 className="text-center my-4 fw-bold">New Arrivals</h2>

          {/* React-Bootstrap Navigation Tabs with Increased Width */}
          <Nav variant="tabs" className="justify-content-center">
            <Nav.Item style={{ flex: 1, textAlign: "center" }}>
              <Nav.Link 
                active={activeTab === "home"} 
                onClick={() => handleTabSelect("home")}
              >
                Home
              </Nav.Link>
            </Nav.Item>
            <Nav.Item style={{ flex: 1, textAlign: "center" }}>
              <Nav.Link 
                active={activeTab === "mens"} 
                onClick={() => handleTabSelect("mens")}
              >
                MENS
              </Nav.Link>
            </Nav.Item>
            <Nav.Item style={{ flex: 1, textAlign: "center" }}>
              <Nav.Link 
                active={activeTab === "womens"} 
                onClick={() => handleTabSelect("womens")}
              >
                WOMENS
              </Nav.Link>
            </Nav.Item>
            <Nav.Item style={{ flex: 1, textAlign: "center" }}>
              <Nav.Link 
                active={activeTab === "kids"} 
                onClick={() => handleTabSelect("kids")}
              >
                KIDS
              </Nav.Link>
            </Nav.Item>
          </Nav>

          <ProductList categoryId={categoryId} />
        </>
      )}

      {/* Newsletter Subscription Component */}
      <NewsletterSubscription />

      <Footer />

      {/* Floating Chatbot Button */}
      <ChatbotButton />
    </Container>
  );
};

export default Home;