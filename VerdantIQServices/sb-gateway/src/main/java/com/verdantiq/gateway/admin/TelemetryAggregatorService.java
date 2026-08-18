package com.verdantiq.gateway.admin;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class TelemetryAggregatorService {

    @Value("${server.port:8080}")
    private String serverPort;

    public TelemetryData getTelemetry() {
        List<Map<String, Object>> services = new ArrayList<>();
        List<Map<String, Object>> metrics = new ArrayList<>();
        RestTemplate restTemplate = new RestTemplate();

        // Spring Boot Actuator Health via HTTP
        Map<String, Object> gatewayService = new HashMap<>();
        gatewayService.put("name", "Spring Boot Gateway");
        try {
            String healthUrl = "http://localhost:" + serverPort + "/actuator/health";
            Map healthResponse = restTemplate.getForObject(healthUrl, Map.class);
            gatewayService.put("status", healthResponse != null ? healthResponse.get("status") : "UNKNOWN");
        } catch (Exception e) {
            gatewayService.put("status", "DOWN");
        }
        services.add(gatewayService);

        // FastAPI Reachability Check
        Map<String, Object> mlService = new HashMap<>();
        mlService.put("name", "FastAPI ML Service");
        try {
            // Assume the proxy base is on localhost:8000 for this check
            restTemplate.getForEntity("http://localhost:8000/docs", String.class);
            mlService.put("status", "UP");
        } catch (Exception e) {
            mlService.put("status", "DOWN");
            mlService.put("error", e.getMessage());
        }
        services.add(mlService);

        // Actuator Metrics via HTTP
        try {
            String memUrl = "http://localhost:" + serverPort + "/actuator/metrics/jvm.memory.used";
            Map memResponse = restTemplate.getForObject(memUrl, Map.class);
            Map<String, Object> memoryMetric = new HashMap<>();
            memoryMetric.put("name", "jvm.memory.used");
            memoryMetric.put("measurements", memResponse != null ? memResponse.get("measurements") : null);
            metrics.add(memoryMetric);
        } catch (Exception e) {
            // Ignore if metrics endpoint is not exposed
        }

        return new TelemetryData(services, metrics);
    }
}
