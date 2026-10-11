package com.verdantiq.gateway.institution;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InstitutionChallengeRepository extends MongoRepository<InstitutionChallenge, String> {
    List<InstitutionChallenge> findByTenantId(String tenantId);
}
