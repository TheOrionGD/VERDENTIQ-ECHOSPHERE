package com.verdantiq.gateway.admin;

import com.verdantiq.gateway.region.DomainOversightRecord;
import com.verdantiq.gateway.region.TenantRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin")
@PreAuthorize("hasRole('PLATFORM_ADMIN')")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @GetMapping("/tenant-requests")
    public ResponseEntity<List<TenantRequest>> getTenantRequests() {
        return ResponseEntity.ok(adminService.getTenantRequests());
    }

    @GetMapping("/rbac-schema")
    @PreAuthorize("hasRole('PLATFORM_ADMIN')")
    public ResponseEntity<List<RBACSchemaRole>> getRbacSchema() {
        return ResponseEntity.ok(adminService.getRbacSchema());
    }

    @GetMapping("/database-status")
    public ResponseEntity<DatabaseStatus> getDatabaseStatus() {
        return ResponseEntity.ok(adminService.getDatabaseStatus());
    }

    @GetMapping("/audit-logs")
    public ResponseEntity<List<AdminAuditLog>> getAuditLogs() {
        return ResponseEntity.ok(adminService.getAuditLogs());
    }

    @GetMapping("/access-grants")
    public ResponseEntity<List<AccessGrant>> getAccessGrants() {
        return ResponseEntity.ok(adminService.getAccessGrants());
    }

    @GetMapping("/feature-flags")
    public ResponseEntity<List<FeatureFlag>> getFeatureFlags() {
        return ResponseEntity.ok(adminService.getFeatureFlags());
    }

    @GetMapping("/rate-limits")
    public ResponseEntity<List<RateLimitRule>> getRateLimits() {
        return ResponseEntity.ok(adminService.getRateLimits());
    }

    @GetMapping("/broadcasts")
    public ResponseEntity<List<SystemBroadcast>> getBroadcasts() {
        return ResponseEntity.ok(adminService.getBroadcasts());
    }

    @GetMapping("/telemetry")
    public ResponseEntity<TelemetryData> getTelemetry() {
        return ResponseEntity.ok(adminService.getTelemetry());
    }

    @GetMapping("/domains")
    public ResponseEntity<List<DomainOversightRecord>> getDomains() {
        return ResponseEntity.ok(adminService.getDomains());
    }
}
