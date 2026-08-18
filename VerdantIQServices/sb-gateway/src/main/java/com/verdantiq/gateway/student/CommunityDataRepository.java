package com.verdantiq.gateway.student;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommunityDataRepository extends MongoRepository<CommunityData, String> {
    List<CommunityData> findByTenantId(String tenantId);
    List<CommunityData> findByDeptId(String deptId);
    List<CommunityData> findByUid(String uid);
}
