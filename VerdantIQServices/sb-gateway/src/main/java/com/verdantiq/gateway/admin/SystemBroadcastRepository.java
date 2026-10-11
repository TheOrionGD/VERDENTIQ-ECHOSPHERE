package com.verdantiq.gateway.admin;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SystemBroadcastRepository extends MongoRepository<SystemBroadcast, String> {
}
