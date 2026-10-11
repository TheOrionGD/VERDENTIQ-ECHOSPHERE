package com.verdantiq.gateway.common;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ActivityHistoryItemRepository extends MongoRepository<ActivityHistoryItem, String> {
    List<ActivityHistoryItem> findByTenantId(String tenantId);
}
