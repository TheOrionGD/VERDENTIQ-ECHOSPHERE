package com.verdantiq.gateway.user;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LinkedDeviceRepository extends MongoRepository<LinkedDevice, String> {
    List<LinkedDevice> findByHouseholdId(String householdId);
}
