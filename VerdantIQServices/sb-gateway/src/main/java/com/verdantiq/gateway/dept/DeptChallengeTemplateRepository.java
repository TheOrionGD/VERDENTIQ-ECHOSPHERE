package com.verdantiq.gateway.dept;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DeptChallengeTemplateRepository extends MongoRepository<DeptChallengeTemplate, String> {
    List<DeptChallengeTemplate> findByDeptId(String deptId);
}
