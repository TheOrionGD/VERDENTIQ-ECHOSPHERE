package com.verdantiq.gateway.dept;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DeptTriggerSettingsRepository extends MongoRepository<DeptTriggerSettings, String> {
    List<DeptTriggerSettings> findByDeptId(String deptId);
}
