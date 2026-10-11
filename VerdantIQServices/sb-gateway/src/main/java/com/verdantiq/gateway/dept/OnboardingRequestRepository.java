package com.verdantiq.gateway.dept;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OnboardingRequestRepository extends MongoRepository<OnboardingRequest, String> {
    List<OnboardingRequest> findByDeptId(String deptId);
}
