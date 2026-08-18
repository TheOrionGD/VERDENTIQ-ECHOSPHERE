package com.verdantiq.gateway.auditor;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AuditSettingsRepository extends MongoRepository<AuditSettings, String> {
}
