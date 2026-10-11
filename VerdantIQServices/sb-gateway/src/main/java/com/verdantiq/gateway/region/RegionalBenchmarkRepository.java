package com.verdantiq.gateway.region;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RegionalBenchmarkRepository extends MongoRepository<RegionalBenchmark, String> {
    List<RegionalBenchmark> findByRegionId(String regionId);
    List<RegionalBenchmark> findByStateId(String stateId);
}
