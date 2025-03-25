import React from "react";
import { Card, Button, Form } from "react-bootstrap";

const InviteFriends = () => {
  return (
    <div>
      <h4 className="mb-4 fw-bold text-dark">Invite Friends</h4>
      <Card className="border-0 shadow-sm mb-4">
        <Card.Body>
          <h5 className="mb-3">Earn $20 for Each Friend</h5>
          <p className="text-muted mb-3">
            Share your referral link and get $20 when your friends make their first purchase.
          </p>
          <Form.Group className="mb-3">
            <Form.Label>Your Referral Link</Form.Label>
            <Form.Control
              type="text"
              value="https://athena.com/invite/yourcode"
              readOnly
            />
          </Form.Group>
          <Button variant="dark" className="rounded-pill me-2">
            Copy Link
          </Button>
          <Button variant="outline-dark" className="rounded-pill">
            Share via Email
          </Button>
        </Card.Body>
      </Card>
    </div>
  );
};

export default InviteFriends;