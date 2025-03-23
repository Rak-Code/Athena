// AddressService.js
import axios from 'axios';

const API_URL = 'http://localhost:8080/api/addresses';

// Get all addresses for a user
export const getUserAddresses = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user addresses:', error);
    throw error;
  }
};

// Get a specific address by ID
export const getAddressById = async (addressId) => {
  try {
    const response = await axios.get(`${API_URL}/${addressId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching address:', error);
    throw error;
  }
};

// Create a new address for a user
export const createAddress = async (userId, addressData) => {
  try {
    const response = await axios.post(`${API_URL}/user/${userId}`, addressData);
    return response.data;
  } catch (error) {
    console.error('Error creating address:', error);
    throw error;
  }
};

// Update an existing address
export const updateAddress = async (addressId, addressData) => {
  try {
    const response = await axios.put(`${API_URL}/${addressId}`, addressData);
    return response.data;
  } catch (error) {
    console.error('Error updating address:', error);
    throw error;
  }
};

// Delete an address
export const deleteAddress = async (addressId) => {
  try {
    await axios.delete(`${API_URL}/${addressId}`);
    return true;
  } catch (error) {
    console.error('Error deleting address:', error);
    throw error;
  }
};

// Get the default address for a user
export const getDefaultAddress = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/user/${userId}/default`);
    return response.data;
  } catch (error) {
    console.error('Error fetching default address:', error);
    throw error;
  }
};

// Get addresses by type (shipping, billing, both)
export const getAddressesByType = async (userId, addressType) => {
  try {
    const response = await axios.get(`${API_URL}/user/${userId}/type/${addressType}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching addresses by type:', error);
    throw error;
  }
};