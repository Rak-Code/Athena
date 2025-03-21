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
          <ul className="nav nav-tabs">
            <li className="nav-item">
              <a className="nav-link active" aria-current="page" href="#">Home</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">MENS</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">WOMENS</a>
            </li>
            <li className="nav-item">
              <a className="nav-link disabled" aria-disabled="true">KIDS</a>
            </li>
          </ul>
          <ProductList />
        </>
      )}

      <Footer />
    </Container>
  );
};

export default Home;
