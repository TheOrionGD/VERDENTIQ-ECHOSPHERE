package com.verdantiq.gateway.region;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HouseholdRecordRepository extends MongoRepository<HouseholdRecord, String> {
    List<HouseholdRecord> findByRegionId(String regionId);
    List<HouseholdRecord> findByStateId(String stateId);
}
