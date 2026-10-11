package com.verdantiq.gateway.user;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ActivityLogRepository extends MongoRepository<ActivityLog, String> {
    List<ActivityLog> findByHouseholdId(String householdId);
    List<ActivityLog> findByHouseholdIdAndTenantId(String householdId, String tenantId);
    List<ActivityLog> findByTenantId(String tenantId);
}
