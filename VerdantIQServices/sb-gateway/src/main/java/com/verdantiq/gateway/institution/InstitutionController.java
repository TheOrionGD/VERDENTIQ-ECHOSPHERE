package com.verdantiq.gateway.institution;

import com.verdantiq.gateway.common.ProxyService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/institution")
@PreAuthorize("hasRole('INSTITUTION_ADMIN')")
public class InstitutionController {

    @Autowired
    private InstitutionService institutionService;

    @Autowired
    private ProxyService proxyService;

    @GetMapping("/dashboard")
    public ResponseEntity<InstitutionDashboardMetrics> getDashboard() {
        return ResponseEntity.ok(institutionService.getDashboard());
    }

    @GetMapping("/departments")
    @PreAuthorize("hasRole('INSTITUTION_ADMIN')")
    public ResponseEntity<List<InstitutionDepartmentRecord>> getDepartments() {
        return ResponseEntity.ok(institutionService.getDepartments());
    }

    @PostMapping("/departments")
    public ResponseEntity<InstitutionDepartmentRecord> addDepartment(@RequestBody InstitutionDepartmentRecord dept) {
        return ResponseEntity.ok(institutionService.addDepartment(dept));
    }

    @GetMapping("/challenges")
    public ResponseEntity<List<InstitutionChallenge>> getChallenges() {
        return ResponseEntity.ok(institutionService.getChallenges());
    }

    @GetMapping("/geofence")
    public ResponseEntity<List<GeofencePolygon>> getGeofences() {
        return ResponseEntity.ok(institutionService.getGeofences());
    }

    @PostMapping("/geofence")
    public ResponseEntity<GeofencePolygon> updateGeofence(@RequestBody GeofencePolygon polygon) {
        return ResponseEntity.ok(institutionService.updateGeofence(polygon));
    }

    @GetMapping("/reports")
    public ResponseEntity<List<InstitutionReport>> getReports() {
        return ResponseEntity.ok(institutionService.getReports());
    }

    @GetMapping("/reports/download")
    public ResponseEntity<byte[]> downloadPdfReport() throws Exception {
        byte[] pdfBytes = institutionService.generatePdfReport();
        
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDisposition(org.springframework.http.ContentDisposition.attachment().filename("institution_report.pdf").build());
        headers.setCacheControl("must-revalidate, post-check=0, pre-check=0");

        return ResponseEntity.ok()
                .headers(headers)
                .body(pdfBytes);
    }

    @GetMapping("/analytics")
    public ResponseEntity<InstitutionAnalyticsData> getAnalytics() {
        return ResponseEntity.ok(institutionService.getAnalytics());
    }

    @GetMapping("/settings")
    public ResponseEntity<InstitutionSettings> getSettings() {
        return ResponseEntity.ok(institutionService.getSettings());
    }

    @GetMapping("/escalation-resolutions")
    public ResponseEntity<List<EscalationResolution>> getEscalationResolutions() {
        return ResponseEntity.ok(institutionService.getEscalationResolutions());
    }

    @GetMapping("/challenge-approvals")
    public ResponseEntity<List<ChallengeApprovalItem>> getChallengeApprovals() {
        return ResponseEntity.ok(institutionService.getChallengeApprovals());
    }

    @GetMapping("/executive-report-schedules")
    public ResponseEntity<List<ExecutiveReportSchedule>> getExecutiveReportSchedules() {
        return ResponseEntity.ok(institutionService.getExecutiveReportSchedules());
    }

    @GetMapping("/onboarding-funnel")
    public ResponseEntity<List<OnboardingFunnelStep>> getOnboardingFunnel() {
        return ResponseEntity.ok(institutionService.getOnboardingFunnel());
    }

    @GetMapping("/accepted-domains")
    public ResponseEntity<List<String>> getAcceptedDomains() {
        // Return just the string names to match the contract "Array of string"
        return ResponseEntity.ok(institutionService.getAcceptedDomains().stream()
                .map(AcceptedDomain::getName)
                .collect(Collectors.toList()));
    }

    // Proxy endpoints
    @GetMapping("/milp-scenarios")
    public ResponseEntity<String> getMilpScenarios(HttpServletRequest request) {
        java.util.Map<String, Object> payload = new java.util.HashMap<>();
        payload.put("weights", java.util.Map.of("cost", 1.0, "carbon", 1.0, "comfort", 1.0));
        payload.put("max_actions_per_household", 3);
        
        // Hydrate from real data instead of stubs
        java.util.List<InstitutionDepartmentRecord> departments = institutionService.getDepartments();
        payload.put("departments", departments);
        payload.put("analytics", institutionService.getAnalytics());
        
        payload.put("tenant_id", ((com.verdantiq.gateway.common.security.CustomUserDetails) org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getTenantId());

        return proxyService.proxyRequest(request, HttpMethod.POST, payload, "/api/v1/institution/milp-scenarios");
    }

    @GetMapping("/xgboost-kpi-suggestions")
    public ResponseEntity<String> getXgboostKpiSuggestions(HttpServletRequest request) {
        // MLPayloadRequest shape
        java.util.Map<String, Object> payload = new java.util.HashMap<>();
        payload.put("history", new java.util.ArrayList<>());
        payload.put("tenant_id", ((com.verdantiq.gateway.common.security.CustomUserDetails) org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getTenantId());
        return proxyService.proxyRequest(request, HttpMethod.POST, payload, "/api/v1/institution/xgboost-kpi-suggestions");
    }

    @GetMapping("/anomaly-trends")
    public ResponseEntity<String> getAnomalyTrends(HttpServletRequest request) {
        // MLPayloadRequest shape
        java.util.Map<String, Object> payload = new java.util.HashMap<>();
        payload.put("history", new java.util.ArrayList<>());
        payload.put("tenant_id", ((com.verdantiq.gateway.common.security.CustomUserDetails) org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getTenantId());
        return proxyService.proxyRequest(request, HttpMethod.POST, payload, "/api/v1/institution/anomaly-trends");
    }
}
