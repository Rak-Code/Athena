import React from "react";
import { Carousel } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const CarouselComponent = () => {
  return (
    <Carousel className="shadow-sm mt-4">
      <Carousel.Item>
        <img
          className="d-block w-100"
          src="https://images.pexels.com/photos/9825209/pexels-photo-9825209.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
          alt="First slide"
          style={{ height: "500px", objectFit: "cover" }}
        />
        <Carousel.Caption >
          <h3>Discover the Latest Fashion</h3>
          <p>Shop trendy and stylish clothing with ease.</p>
        </Carousel.Caption>
      </Carousel.Item>

      <Carousel.Item>
        <img
          className="d-block w-100"
          src="https://images.pexels.com/photos/5662862/pexels-photo-5662862.png?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
          alt="Second slide"
          style={{ height: "500px", objectFit: "cover" }}
        />
        <Carousel.Caption>
          <h3>Exclusive Deals for You</h3>
          <p>Get the best discounts on premium fashion brands.</p>
        </Carousel.Caption>
      </Carousel.Item>

      <Carousel.Item>
        <img
          className="d-block w-100"
          src="https://images.pexels.com/photos/6795794/pexels-photo-6795794.jpeg?auto=compress&cs=tinysrgb&w=600"
          alt="Third slide"
          style={{ height: "500px", objectFit: "cover" }}
        />
        <Carousel.Caption>
          <h3>New Arrivals Every Week</h3>
          <p>Stay ahead with the latest collections.</p>
        </Carousel.Caption>
      </Carousel.Item>
    </Carousel>
  );
};

export default CarouselComponent;