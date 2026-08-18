package com.verdantiq.gateway.institution;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InstitutionDepartmentRecordRepository extends MongoRepository<InstitutionDepartmentRecord, String> {
    List<InstitutionDepartmentRecord> findByTenantId(String tenantId);
}
