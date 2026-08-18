package com.verdantiq.gateway.region;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DomainOversightRecordRepository extends MongoRepository<DomainOversightRecord, String> {
    List<DomainOversightRecord> findByRegionId(String regionId);
    List<DomainOversightRecord> findByStateId(String stateId);
}
