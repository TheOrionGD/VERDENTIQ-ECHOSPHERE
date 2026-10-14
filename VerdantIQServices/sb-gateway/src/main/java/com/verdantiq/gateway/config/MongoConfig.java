package com.verdantiq.gateway.config;

import com.mongodb.ConnectionString;
import com.mongodb.MongoClientSettings;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.config.EnableMongoAuditing;

@Configuration
@EnableMongoAuditing
public class MongoConfig {

    @Value("${spring.data.mongodb.uri:mongodb://oriongd:personal@ac-3atohep-shard-00-00.cadm698.mongodb.net:27017,ac-3atohep-shard-00-01.cadm698.mongodb.net:27017,ac-3atohep-shard-00-02.cadm698.mongodb.net:27017/?ssl=true&replicaSet=atlas-4wi0a6-shard-0&authSource=admin&appName=Projects}")
    private String mongoUri;

    @Bean
    public MongoClient mongoClient() {
        ConnectionString connectionString = new ConnectionString(mongoUri);
        MongoClientSettings settings = MongoClientSettings.builder()
                .applyConnectionString(connectionString)
                .build();
        return MongoClients.create(settings);
    }
}
