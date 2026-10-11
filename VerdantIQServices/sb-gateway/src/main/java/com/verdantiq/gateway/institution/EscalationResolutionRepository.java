package com.verdantiq.gateway.institution;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EscalationResolutionRepository extends MongoRepository<EscalationResolution, String> {
    List<EscalationResolution> findByTenantId(String tenantId);
}
