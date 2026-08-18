package com.verdantiq.gateway.admin;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "ratelimitrules")
public class RateLimitRule {
    @Id
    private String id;
    private String endpointPrefix;
    private int capacity;
    private int refillTokens;
    private int refillDurationSeconds;
}
