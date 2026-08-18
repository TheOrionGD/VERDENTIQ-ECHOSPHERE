package com.verdantiq.gateway.dept;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SubCohortRepository extends MongoRepository<SubCohort, String> {
    List<SubCohort> findByDeptId(String deptId);
}
