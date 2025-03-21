import React from "react";
import { Container } from "react-bootstrap";
import CarouselComponent from "../components/CarouselComponent";
import ProductList from "../components/ProductList";
import Footer from "../components/Footer";

const Home = ({ searchTerm }) => {
  return (
    <Container className="mt-4">
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
          <ProductList />
        </>
      )}

      <Footer />
    </Container>
  );
};

export default Home;
