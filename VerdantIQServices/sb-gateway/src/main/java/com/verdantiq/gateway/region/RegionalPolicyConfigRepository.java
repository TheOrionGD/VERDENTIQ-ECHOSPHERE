package com.verdantiq.gateway.region;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RegionalPolicyConfigRepository extends MongoRepository<RegionalPolicyConfig, String> {
    List<RegionalPolicyConfig> findByRegionId(String regionId);
    List<RegionalPolicyConfig> findByStateId(String stateId);
}
