package com.verdantiq.gateway.student;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GeofencedChallengeRepository extends MongoRepository<GeofencedChallenge, String> {
    List<GeofencedChallenge> findByTenantId(String tenantId);
    List<GeofencedChallenge> findByDeptId(String deptId);
    List<GeofencedChallenge> findByUid(String uid);
}
