package com.verdantiq.gateway.user;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserReportRepository extends MongoRepository<UserReport, String> {
    List<UserReport> findByHouseholdId(String householdId);
}
