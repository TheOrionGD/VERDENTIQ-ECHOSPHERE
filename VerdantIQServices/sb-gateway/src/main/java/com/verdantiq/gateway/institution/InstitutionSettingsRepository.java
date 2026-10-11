package com.verdantiq.gateway.institution;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InstitutionSettingsRepository extends MongoRepository<InstitutionSettings, String> {
    List<InstitutionSettings> findByTenantId(String tenantId);
}
