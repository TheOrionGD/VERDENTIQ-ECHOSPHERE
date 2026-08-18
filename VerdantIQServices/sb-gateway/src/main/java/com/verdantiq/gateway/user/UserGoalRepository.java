package com.verdantiq.gateway.user;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserGoalRepository extends MongoRepository<UserGoal, String> {
    List<UserGoal> findByHouseholdId(String householdId);
}
