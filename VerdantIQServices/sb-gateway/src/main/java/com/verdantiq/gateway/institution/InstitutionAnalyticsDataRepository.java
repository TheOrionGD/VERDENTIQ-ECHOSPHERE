package com.verdantiq.gateway.institution;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InstitutionAnalyticsDataRepository extends MongoRepository<InstitutionAnalyticsData, String> {
    List<InstitutionAnalyticsData> findByTenantId(String tenantId);
}
