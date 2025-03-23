package com.example.backend.services;

import com.example.backend.model.Address;
import com.example.backend.model.User;
import com.example.backend.repository.AddressRepository;
import com.example.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class AddressService {

    @Autowired
    private AddressRepository addressRepository;

    @Autowired
    private UserRepository userRepository;

    public List<Address> getAllAddressesByUserId(Long userId) {
        return addressRepository.findByUserUserId(userId);
    }

    public Optional<Address> getAddressById(Long addressId) {
        return addressRepository.findById(addressId);
    }

    @Transactional
    public Address createAddress(Long userId, Address address) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        // If this is the first address or it's marked as default
        if (address.isDefault() || addressRepository.findByUserUserId(userId).isEmpty()) {
            // Set all existing addresses to non-default
            addressRepository.findByUserUserId(userId).forEach(existingAddress -> {
                existingAddress.setDefault(false);
                addressRepository.save(existingAddress);
            });
            address.setDefault(true);
        }

        address.setUser(user);
        return addressRepository.save(address);
    }

    @Transactional
    public Address updateAddress(Long addressId, Address addressDetails) {
        Address address = addressRepository.findById(addressId)
                .orElseThrow(() -> new RuntimeException("Address not found with id: " + addressId));

        address.setAddressLine1(addressDetails.getAddressLine1());
        address.setAddressLine2(addressDetails.getAddressLine2());
        address.setCity(addressDetails.getCity());
        address.setState(addressDetails.getState());
        address.setPostalCode(addressDetails.getPostalCode());
        address.setCountry(addressDetails.getCountry());
        address.setAddressType(addressDetails.getAddressType());

        // If setting this address as default
        if (addressDetails.isDefault() && !address.isDefault()) {
            // Set all other addresses of this user to non-default
            addressRepository.findByUserUserId(address.getUser().getUserId()).forEach(existingAddress -> {
                if (!existingAddress.getId().equals(addressId)) {
                    existingAddress.setDefault(false);
                    addressRepository.save(existingAddress);
                }
            });
            address.setDefault(true);
        }

        return addressRepository.save(address);
    }

    @Transactional
    public void deleteAddress(Long addressId) {
        Address address = addressRepository.findById(addressId)
                .orElseThrow(() -> new RuntimeException("Address not found with id: " + addressId));

        // If deleting the default address, set another one as default if available
        if (address.isDefault()) {
            List<Address> otherAddresses = addressRepository.findByUserUserId(address.getUser().getUserId());
            otherAddresses.remove(address);

            if (!otherAddresses.isEmpty()) {
                Address newDefault = otherAddresses.get(0);
                newDefault.setDefault(true);
                addressRepository.save(newDefault);
            }
        }

        addressRepository.deleteById(addressId);
    }

    public Optional<Address> getDefaultAddress(Long userId) {
        return Optional.ofNullable(addressRepository.findByUserUserIdAndIsDefaultTrue(userId));
    }

    public List<Address> getAddressesByType(Long userId, String addressType) {
        return addressRepository.findByUserUserIdAndAddressType(userId, addressType);
    }
}