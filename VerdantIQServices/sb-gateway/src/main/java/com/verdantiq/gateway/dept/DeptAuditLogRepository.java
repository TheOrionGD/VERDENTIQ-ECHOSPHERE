package com.verdantiq.gateway.dept;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DeptAuditLogRepository extends MongoRepository<DeptAuditLog, String> {
    List<DeptAuditLog> findByDeptId(String deptId);
}
