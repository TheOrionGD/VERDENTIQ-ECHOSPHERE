package com.verdantiq.gateway.institution;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GeofencePolygonRepository extends MongoRepository<GeofencePolygon, String> {
    List<GeofencePolygon> findByTenantId(String tenantId);
}
