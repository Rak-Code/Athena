// AddressForm.jsx
import React from 'react';
import { Form, Row, Col } from 'react-bootstrap';

const AddressForm = ({ 
  addressData, 
  onChange, 
  showAddressType = false,
  showDefaultOption = false,
  prefix = '' 
}) => {
  // If prefix is provided, prepend it to field names (e.g., "billing" + "AddressLine1" = "billingAddressLine1")
  const fieldName = (name) => prefix ? `${prefix}${name.charAt(0).toUpperCase() + name.slice(1)}` : name;

  return (
    <>
      <Form.Group className="mb-3">
        <Form.Label>Address Line 1</Form.Label>
        <Form.Control
          type="text"
          name={fieldName('addressLine1')}
          value={addressData[fieldName('addressLine1')] || ''}
          onChange={onChange}
          placeholder="Street address, P.O. box"
          required
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Address Line 2</Form.Label>
        <Form.Control
          type="text"
          name={fieldName('addressLine2')}
          value={addressData[fieldName('addressLine2')] || ''}
          onChange={onChange}
          placeholder="Apartment, suite, unit, building, floor, etc."
        />
      </Form.Group>

      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>City</Form.Label>
            <Form.Control
              type="text"
              name={fieldName('city')}
              value={addressData[fieldName('city')] || ''}
              onChange={onChange}
              placeholder="City"
              required
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>State</Form.Label>
            <Form.Control
              type="text"
              name={fieldName('state')}
              value={addressData[fieldName('state')] || ''}
              onChange={onChange}
              placeholder="State/Province"
              required
            />
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Postal Code</Form.Label>
            <Form.Control
              type="text"
              name={fieldName('postalCode')}
              value={addressData[fieldName('postalCode')] || ''}
              onChange={onChange}
              placeholder="Postal/ZIP code"
              required
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Country</Form.Label>
            <Form.Control
              type="text"
              name={fieldName('country')}
              value={addressData[fieldName('country')] || ''}
              onChange={onChange}
              placeholder="Country"
              required
              defaultValue="India"
            />
          </Form.Group>
        </Col>
      </Row>

      {showAddressType && (
        <Form.Group className="mb-3">
          <Form.Label>Address Type</Form.Label>
          <Form.Select
            name={fieldName('addressType')}
            value={addressData[fieldName('addressType')] || 'SHIPPING'}
            onChange={onChange}
            required
          >
            <option value="SHIPPING">Shipping</option>
            <option value="BILLING">Billing</option>
            <option value="BOTH">Both (Shipping & Billing)</option>
          </Form.Select>
        </Form.Group>
      )}

      {showDefaultOption && (
        <Form.Group className="mb-3">
          <Form.Check
            type="checkbox"
            id={`default-${prefix}`}
            name={fieldName('default')}
            checked={addressData[fieldName('default')] || false}
            onChange={(e) => onChange({
              target: {
                name: fieldName('default'),
                value: e.target.checked
              }
            })}
            label="Set as default address"
          />
        </Form.Group>
      )}
    </>
  );
};

export default AddressForm;