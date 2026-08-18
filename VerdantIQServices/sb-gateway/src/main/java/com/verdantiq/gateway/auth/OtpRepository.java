package com.verdantiq.gateway.auth;

import org.springframework.data.mongodb.repository.MongoRepository;

public interface OtpRepository extends MongoRepository<OtpEntity, String> {
}
