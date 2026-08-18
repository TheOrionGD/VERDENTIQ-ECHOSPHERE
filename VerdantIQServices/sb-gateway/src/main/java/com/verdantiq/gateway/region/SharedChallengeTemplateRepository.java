package com.verdantiq.gateway.region;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SharedChallengeTemplateRepository extends MongoRepository<SharedChallengeTemplate, String> {
    List<SharedChallengeTemplate> findByRegionId(String regionId);
    List<SharedChallengeTemplate> findByStateId(String stateId);
}
