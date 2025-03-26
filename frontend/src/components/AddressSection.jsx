import React, { useState, useEffect } from 'react';
import { Card, Button, Modal, Row, Col, Alert, Badge } from 'react-bootstrap';
import AddressForm from './AddressForm';
import { getUserAddresses, createAddress, updateAddress, deleteAddress } from '../services/addressService';

const AddressSection = ({ userId }) => {
  const [addresses, setAddresses] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India',
    addressType: 'SHIPPING',
    default: false
  });

  useEffect(() => {
    loadAddresses();
  }, [userId]);

  const loadAddresses = async () => {
    try {
      const data = await getUserAddresses(userId);
      setAddresses(data);
    } catch (err) {
      setError('Failed to load addresses');
      console.error(err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    try {
      await createAddress(userId, formData);
      setShowAddModal(false);
      setFormData({
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        postalCode: '',
        country: 'India',
        addressType: 'SHIPPING',
        default: false
      });
      loadAddresses();
    } catch (err) {
      setError('Failed to add address');
      console.error(err);
    }
  };

  const handleEditAddress = async (e) => {
    e.preventDefault();
    try {
      await updateAddress(selectedAddress.id, formData);
      setShowEditModal(false);
      setSelectedAddress(null);
      loadAddresses();
    } catch (err) {
      setError('Failed to update address');
      console.error(err);
    }
  };

  const handleDeleteAddress = async (addressId) => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      try {
        await deleteAddress(addressId);
        loadAddresses();
      } catch (err) {
        setError('Failed to delete address');
        console.error(err);
      }
    }
  };

  const openEditModal = (address) => {
    setSelectedAddress(address);
    setFormData({
      addressLine1: address.addressLine1,
      addressLine2: address.addressLine2 || '',
      city: address.city,
      state: address.state,
      postalCode: address.postalCode,
      country: address.country,
      addressType: address.addressType,
      default: address.default
    });
    setShowEditModal(true);
  };

  return (
    <div className="address-section">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>My Addresses</h3>
        <Button variant="primary" onClick={() => setShowAddModal(true)}>
          Add New Address
        </Button>
      </div>

      {error && <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert>}

      <Row>
        {addresses.map(address => (
          <Col md={6} key={address.id} className="mb-3">
            <Card>
              <Card.Body>
                <Card.Title className="d-flex justify-content-between align-items-center">
                  {address.addressType}
                  {address.default && <Badge bg="success">Default</Badge>}
                </Card.Title>
                <Card.Text>
                  {address.addressLine1}<br />
                  {address.addressLine2 && <>{address.addressLine2}<br /></>}
                  {address.city}, {address.state} {address.postalCode}<br />
                  {address.country}
                </Card.Text>
                <div className="d-flex justify-content-end gap-2">
                  <Button variant="outline-primary" size="sm" onClick={() => openEditModal(address)}>
                    Edit
                  </Button>
                  <Button variant="outline-danger" size="sm" onClick={() => handleDeleteAddress(address.id)}>
                    Delete
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Add Address Modal */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Address</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleAddAddress}>
            <AddressForm
              addressData={formData}
              onChange={handleInputChange}
              showAddressType={true}
              showDefaultOption={true}
            />
            <div className="d-flex justify-content-end gap-2">
              <Button variant="secondary" onClick={() => setShowAddModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                Save Address
              </Button>
            </div>
          </form>
        </Modal.Body>
      </Modal>

      {/* Edit Address Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Address</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleEditAddress}>
            <AddressForm
              addressData={formData}
              onChange={handleInputChange}
              showAddressType={true}
              showDefaultOption={true}
            />
            <div className="d-flex justify-content-end gap-2">
              <Button variant="secondary" onClick={() => setShowEditModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                Update Address
              </Button>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default AddressSection; 