package com.example.backend.repository;

import com.example.backend.model.Address;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AddressRepository extends JpaRepository<Address, Long> {
    // Change from findByUserId to findByUserUserId
    List<Address> findByUserUserId(Long userId);
    List<Address> findByUserUserIdAndAddressType(Long userId, String addressType);
    Address findByUserUserIdAndIsDefaultTrue(Long userId);
}