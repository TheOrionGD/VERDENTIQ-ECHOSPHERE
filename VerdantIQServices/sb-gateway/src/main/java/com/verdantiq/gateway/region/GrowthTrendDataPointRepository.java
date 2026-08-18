package com.verdantiq.gateway.region;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GrowthTrendDataPointRepository extends MongoRepository<GrowthTrendDataPoint, String> {
    List<GrowthTrendDataPoint> findByRegionId(String regionId);
    List<GrowthTrendDataPoint> findByStateId(String stateId);
}
