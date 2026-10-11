package com.verdantiq.gateway.admin;

import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.Refill;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class RateLimitConfigService {

    @Autowired
    private RateLimitRuleRepository rateLimitRuleRepository;

    private final Map<String, Bucket> buckets = new ConcurrentHashMap<>();

    @PostConstruct
    public void init() {
        reloadRules();
    }

    public void reloadRules() {
        buckets.clear();
        List<RateLimitRule> rules = rateLimitRuleRepository.findAll();
        
        // If DB is empty, seed a default rule
        if (rules.isEmpty()) {
            RateLimitRule defaultRule = new RateLimitRule(null, "/api/v1", 100, 100, 60);
            rules.add(rateLimitRuleRepository.save(defaultRule));
        }

        for (RateLimitRule rule : rules) {
            Bandwidth limit = Bandwidth.classic(rule.getCapacity(),
                    Refill.greedy(rule.getRefillTokens(), Duration.ofSeconds(rule.getRefillDurationSeconds())));
            Bucket bucket = Bucket.builder()
                    .addLimit(limit)
                    .build();
            buckets.put(rule.getEndpointPrefix(), bucket);
        }
    }

    public Bucket resolveBucket(String path) {
        // Simple prefix match logic for demonstration
        for (Map.Entry<String, Bucket> entry : buckets.entrySet()) {
            if (path.startsWith(entry.getKey())) {
                return entry.getValue();
            }
        }
        return null;
    }

    public List<RateLimitRule> getActiveRules() {
        return rateLimitRuleRepository.findAll();
    }
}
