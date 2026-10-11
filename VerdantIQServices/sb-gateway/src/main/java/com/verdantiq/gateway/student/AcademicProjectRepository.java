package com.verdantiq.gateway.student;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AcademicProjectRepository extends MongoRepository<AcademicProject, String> {
    List<AcademicProject> findByTenantId(String tenantId);
    List<AcademicProject> findByDeptId(String deptId);
    List<AcademicProject> findByUid(String uid);
}
