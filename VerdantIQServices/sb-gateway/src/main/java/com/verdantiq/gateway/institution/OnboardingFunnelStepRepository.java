package com.verdantiq.gateway.institution;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OnboardingFunnelStepRepository extends MongoRepository<OnboardingFunnelStep, String> {
    List<OnboardingFunnelStep> findByTenantId(String tenantId);
}
