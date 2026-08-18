package com.verdantiq.gateway.dept;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StudentRegistryRecordRepository extends MongoRepository<StudentRegistryRecord, String> {
    List<StudentRegistryRecord> findByDeptId(String deptId);
    List<StudentRegistryRecord> findByDeptIdAndTenantId(String deptId, String tenantId);
    List<StudentRegistryRecord> findByTenantId(String tenantId);
}
