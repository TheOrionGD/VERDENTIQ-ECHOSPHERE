package com.verdantiq.gateway.user;

import com.verdantiq.gateway.common.ProxyService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/user")
@PreAuthorize("hasRole('USER')")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private ProxyService proxyService;

    @GetMapping("/dashboard")
    public ResponseEntity<?> getDashboard() {
        return ResponseEntity.ok(userService.getDashboard());
    }

    @GetMapping("/digital-twin")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> getDigitalTwin() {
        DigitalTwinHouse house = userService.getDigitalTwin();
        if (house == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(house);
    }

    @PutMapping("/digital-twin")
    public ResponseEntity<?> updateDigitalTwin(@RequestBody DigitalTwinHouse house) {
        return ResponseEntity.ok(userService.updateDigitalTwin(house));
    }

    @GetMapping("/devices")
    public ResponseEntity<?> getDevices() {
        return ResponseEntity.ok(userService.getDevices());
    }
    
    @GetMapping("/reports")
    public ResponseEntity<List<UserReport>> getReports() {
        return ResponseEntity.ok(userService.getReports());
    }

    @GetMapping("/rewards")
    public ResponseEntity<List<RewardItem>> getRewards() {
        return ResponseEntity.ok(userService.getRewards());
    }

    @GetMapping("/history")
    public ResponseEntity<List<ActivityLog>> getHistory() {
        return ResponseEntity.ok(userService.getHistory());
    }

    @GetMapping("/goals")
    public ResponseEntity<List<UserGoal>> getGoals() {
        return ResponseEntity.ok(userService.getGoals());
    }

    @PutMapping("/goals")
    public ResponseEntity<List<UserGoal>> updateGoals(@RequestBody List<UserGoal> goals) {
        return ResponseEntity.ok(userService.updateGoals(goals));
    }

    // Proxy endpoints
    @GetMapping("/forecast")
    public ResponseEntity<String> getForecast(HttpServletRequest request) {
        java.util.List<ActivityLog> history = userService.getHistory();
        java.util.Map<String, Object> payload = new java.util.HashMap<>();
        payload.put("history", history);
        return proxyService.proxyRequest(request, HttpMethod.POST, payload, "/api/v1/user/forecast");
    }

    @GetMapping("/optimization-actions")
    public ResponseEntity<String> getOptimizationActions(HttpServletRequest request) {
        DigitalTwinHouse twin = userService.getDigitalTwin();
        java.util.List<ActivityLog> history = userService.getHistory();

        java.util.Map<String, Object> payload = new java.util.HashMap<>();
        payload.put("weights", java.util.Map.of("cost", 1.0, "carbon", 1.0, "comfort", 1.0));
        payload.put("max_actions", 5);
        payload.put("twin_data", twin);
        payload.put("history", history);

        return proxyService.proxyRequest(request, HttpMethod.POST, payload, "/api/v1/user/optimization-actions");
    }

    @GetMapping("/anomaly-trends")
    public ResponseEntity<String> getAnomalyTrends(HttpServletRequest request) {
        java.util.List<ActivityLog> history = userService.getHistory();
        java.util.Map<String, Object> payload = new java.util.HashMap<>();
        payload.put("history", history);
        return proxyService.proxyRequest(request, HttpMethod.POST, payload, "/api/v1/user/anomaly-trends");
    }
}
