package com.verdantiq.gateway.institution;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AcceptedDomainRepository extends MongoRepository<AcceptedDomain, String> {
    List<AcceptedDomain> findByTenantId(String tenantId);
}
