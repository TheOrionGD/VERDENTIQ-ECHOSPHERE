package com.verdantiq.gateway.student;

import com.verdantiq.gateway.common.ProxyService;
import com.verdantiq.gateway.user.ActivityLog;
import com.verdantiq.gateway.user.RewardItem;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/student")
public class StudentController {

    @Autowired
    private StudentService studentService;

    @Autowired
    private ProxyService proxyService;

    @PostMapping("/register")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<RegistrationResponse> register(@RequestBody StudentRegistrationRequest request) {
        return ResponseEntity.ok(studentService.register(request));
    }

    @GetMapping("/dashboard")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<StudentDashboardData> getDashboard() {
        return ResponseEntity.ok(studentService.getDashboard());
    }

    @GetMapping("/digital-twin")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<DigitalTwinDorm> getDigitalTwin() {
        return ResponseEntity.ok(studentService.getDigitalTwin());
    }

    @PutMapping("/digital-twin")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<DigitalTwinDorm> updateDigitalTwin(@RequestBody DigitalTwinDorm dorm) {
        return ResponseEntity.ok(studentService.updateDigitalTwin(dorm));
    }

    @GetMapping("/academic-projects")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<List<AcademicProject>> getAcademicProjects() {
        return ResponseEntity.ok(studentService.getAcademicProjects());
    }

    @GetMapping("/challenges")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<List<GeofencedChallenge>> getChallenges() {
        return ResponseEntity.ok(studentService.getChallenges());
    }

    @GetMapping("/community")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<CommunityData> getCommunityData() {
        return ResponseEntity.ok(studentService.getCommunityData());
    }

    @GetMapping("/rewards")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<List<RewardItem>> getRewards() {
        return ResponseEntity.ok(studentService.getRewards());
    }

    @GetMapping("/history")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<List<ActivityLog>> getHistory() {
        return ResponseEntity.ok(studentService.getHistory());
    }

    // Proxy endpoints
    @GetMapping("/forecast")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<String> getForecast(HttpServletRequest request) {
        java.util.List<ActivityLog> history = studentService.getHistory();
        java.util.Map<String, Object> payload = new java.util.HashMap<>();
        payload.put("history", history);
        return proxyService.proxyRequest(request, HttpMethod.POST, payload, "/api/v1/student/forecast");
    }

    @GetMapping("/optimization-actions")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<String> getOptimizationActions(HttpServletRequest request) {
        java.util.Map<String, Object> payload = new java.util.HashMap<>();
        com.verdantiq.gateway.common.security.CustomUserDetails user = (com.verdantiq.gateway.common.security.CustomUserDetails) org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        payload.put("user_id", user.getUid());
        payload.put("tenant_id", user.getTenantId());
        payload.put("weights", java.util.Map.of("cost", 1.0, "carbon", 1.0, "comfort", 1.0));
        payload.put("max_actions", 3);
        
        // Hydrate from real data
        DigitalTwinDorm twin = studentService.getDigitalTwin();
        payload.put("twin_data", twin);
        payload.put("history", studentService.getHistory());

        return proxyService.proxyRequest(request, HttpMethod.POST, payload, "/api/v1/student/optimization-actions");
    }

    @GetMapping("/anomaly-trends")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<String> getAnomalyTrends(HttpServletRequest request) {
        java.util.List<ActivityLog> history = studentService.getHistory();
        java.util.Map<String, Object> payload = new java.util.HashMap<>();
        payload.put("history", history);
        return proxyService.proxyRequest(request, HttpMethod.POST, payload, "/api/v1/student/anomaly-trends");
    }
}
