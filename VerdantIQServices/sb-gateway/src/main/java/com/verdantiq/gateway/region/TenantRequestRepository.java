package com.verdantiq.gateway.region;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TenantRequestRepository extends MongoRepository<TenantRequest, String> {
    List<TenantRequest> findByRegionId(String regionId);
    List<TenantRequest> findByStateId(String stateId);
}
