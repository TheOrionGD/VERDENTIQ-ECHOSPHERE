package com.verdantiq.gateway.dept;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EscalationCaseRepository extends MongoRepository<EscalationCase, String> {
    List<EscalationCase> findByDeptId(String deptId);
    List<EscalationCase> findByDeptIdAndTenantId(String deptId, String tenantId);
}
