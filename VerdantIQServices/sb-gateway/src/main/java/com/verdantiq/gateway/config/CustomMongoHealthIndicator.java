package com.verdantiq.gateway.config;

import org.bson.Document;
import org.springframework.boot.health.contributor.AbstractHealthIndicator;
import org.springframework.boot.health.contributor.Health;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.stereotype.Component;

@Component("mongoHealthIndicator")
public class CustomMongoHealthIndicator extends AbstractHealthIndicator {

    private final MongoTemplate mongoTemplate;

    public CustomMongoHealthIndicator(MongoTemplate mongoTemplate) {
        this.mongoTemplate = mongoTemplate;
    }

    @Override
    protected void doHealthCheck(Health.Builder builder) throws Exception {
        Document result = mongoTemplate.getDb().runCommand(new Document("ping", 1));
        builder.up()
               .withDetail("database", mongoTemplate.getDb().getName())
               .withDetail("ok", result.get("ok"));
    }
}
