package com.verdantiq.gateway.dept;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VerificationItemRepository extends MongoRepository<VerificationItem, String> {
    List<VerificationItem> findByDeptId(String deptId);
    List<VerificationItem> findByDeptIdAndTenantId(String deptId, String tenantId);
}
