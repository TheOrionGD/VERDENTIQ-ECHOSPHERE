package com.verdantiq.gateway.region;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InstitutionRecordRepository extends MongoRepository<InstitutionRecord, String> {
    List<InstitutionRecord> findByRegionId(String regionId);
    List<InstitutionRecord> findByStateId(String stateId);
}
