import React from "react";
import { Card, Button } from "react-bootstrap";

const GiftCards = () => {
  return (
    <div>
      <h4 className="mb-4 fw-bold text-dark">Gift Cards</h4>
      <Card className="border-0 shadow-sm mb-4">
        <Card.Body>
          <h5 className="mb-3">Your Gift Cards</h5>
          <p className="text-muted mb-4">
            View and manage your gift card balance or purchase new gift cards.
          </p>
          <Button variant="dark" className="rounded-pill">
            Purchase Gift Card
          </Button>
        </Card.Body>
      </Card>
    </div>
  );
};

export default GiftCards;