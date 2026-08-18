package com.verdantiq.gateway.auditor;

import com.verdantiq.gateway.common.ProxyService;
import com.verdantiq.gateway.region.DomainOversightRecord;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/audit")
@PreAuthorize("hasRole('AUDITOR') or hasRole('PLATFORM_ADMIN')")
public class AuditorController {

    @Autowired
    private AuditorService auditorService;

    @Autowired
    private ProxyService proxyService;

    @GetMapping("/overview")
    public ResponseEntity<OverviewStats> getOverview() {
        return ResponseEntity.ok(auditorService.getOverview());
    }

    @GetMapping("/logs")
    @PreAuthorize("hasRole('AUDITOR') or hasRole('PLATFORM_ADMIN')")
    public ResponseEntity<List<RedactedAuditLog>> getLogs() {
        return ResponseEntity.ok(auditorService.getRedactedLogs());
    }

    @GetMapping("/requests")
    public ResponseEntity<List<AuditRequest>> getRequests() {
        return ResponseEntity.ok(auditorService.getRequests());
    }

    @GetMapping("/domains")
    public ResponseEntity<List<DomainOversightRecord>> getDomains() {
        return ResponseEntity.ok(auditorService.getDomains());
    }

    @GetMapping("/data-flow")
    public ResponseEntity<List<DataFlowNode>> getDataFlow() {
        return ResponseEntity.ok(auditorService.getDataFlow());
    }

    @GetMapping("/tenant-history")
    public ResponseEntity<List<TenantHistoryEntry>> getTenantHistory() {
        return ResponseEntity.ok(auditorService.getTenantHistory());
    }

    @GetMapping("/export-config")
    public ResponseEntity<ExportConfig> getExportConfig() {
        return ResponseEntity.ok(auditorService.getExportConfig());
    }

    @GetMapping("/settings")
    public ResponseEntity<AuditSettings> getSettings() {
        return ResponseEntity.ok(auditorService.getSettings());
    }

    // Proxy endpoints
    @GetMapping("/model-cards")
    public ResponseEntity<String> getModelCards(HttpServletRequest request) {
        return proxyService.proxyRequest(request, HttpMethod.GET, null, "/api/v1/audit/model-cards");
    }

    @GetMapping("/fairness-reports")
    public ResponseEntity<String> getFairnessReports(HttpServletRequest request) {
        return proxyService.proxyRequest(request, HttpMethod.GET, null, "/api/v1/audit/fairness-reports");
    }
}
