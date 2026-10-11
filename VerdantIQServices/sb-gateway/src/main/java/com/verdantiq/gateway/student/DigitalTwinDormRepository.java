package com.verdantiq.gateway.student;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DigitalTwinDormRepository extends MongoRepository<DigitalTwinDorm, String> {
    List<DigitalTwinDorm> findByTenantId(String tenantId);
    List<DigitalTwinDorm> findByDeptId(String deptId);
    List<DigitalTwinDorm> findByUid(String uid);
}
