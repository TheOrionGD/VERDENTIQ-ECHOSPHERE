package com.verdantiq.gateway.user;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface HouseholdRepository extends MongoRepository<DigitalTwinHouse, String> {
    // Queries can be filtered by ID which represents household_id here
    Optional<DigitalTwinHouse> findById(String id);
}
