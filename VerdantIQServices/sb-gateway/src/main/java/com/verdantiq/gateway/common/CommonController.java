package com.verdantiq.gateway.common;

import com.verdantiq.gateway.common.security.CustomUserDetails;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1")
@PreAuthorize("isAuthenticated()")
public class CommonController {

    @Autowired
    private CommonService commonService;

    @Autowired
    private SseConnectionManager sseConnectionManager;

    @Autowired
    private com.verdantiq.gateway.audit.AuditLogRepository auditLogRepository;

    @GetMapping("/activity")
    public ResponseEntity<List<ActivityHistoryItem>> getActivity(@AuthenticationPrincipal CustomUserDetails userDetails) {
        return ResponseEntity.ok(commonService.getActivity(userDetails.getTenantId()));
    }

    @PostMapping("/activity")
    public ResponseEntity<ActivityHistoryItem> logActivity(@RequestBody ActivityHistoryItem item, @AuthenticationPrincipal CustomUserDetails userDetails) {
        return ResponseEntity.ok(commonService.logActivity(item, userDetails.getTenantId()));
    }

    @GetMapping("/notifications")
    public ResponseEntity<List<Notification>> getNotifications(@AuthenticationPrincipal CustomUserDetails userDetails) {
        return ResponseEntity.ok(commonService.getNotifications(userDetails.getTenantId()));
    }

    @com.verdantiq.gateway.audit.AuditableWrite(action = "READ", resourceType = "Notification")
    @PatchMapping("/notifications/{id}/read") public ResponseEntity<Map<String, Boolean>> markAsRead(@PathVariable String id, @AuthenticationPrincipal CustomUserDetails userDetails) {
        commonService.markNotificationAsRead(id, userDetails);
        Map<String, Boolean> response = new HashMap<>();
        response.put("success", true);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/notifications/mark-all-read")
    public ResponseEntity<Map<String, Boolean>> markAllAsRead(@AuthenticationPrincipal CustomUserDetails userDetails) {
        commonService.markAllNotificationsAsRead(userDetails.getTenantId());
        Map<String, Boolean> response = new HashMap<>();
        response.put("success", true);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/notifications")
    public ResponseEntity<Notification> addNotification(@RequestBody Notification notification, @AuthenticationPrincipal CustomUserDetails userDetails) {
        // System or users can add notifications. For this stub, we map it to the caller's tenant.
        // A real system might allow specifying targetTenantId.
        return ResponseEntity.ok(commonService.addNotification(notification, userDetails.getTenantId()));
    }

    @GetMapping("/tenant-privacy/check")
    public ResponseEntity<Boolean> checkTenantPrivacy(@RequestParam String tenantId, @AuthenticationPrincipal CustomUserDetails userDetails) {
        auditLogRepository.findAll();
        boolean access = userDetails.getTenantId() != null && userDetails.getTenantId().equals(tenantId);
        return ResponseEntity.ok(access);
    }

    @PostMapping("/tenant-privacy/verify-access")
    public ResponseEntity<Map<String, Object>> verifyAccess(@RequestBody Map<String, String> payload, @AuthenticationPrincipal CustomUserDetails userDetails) {
        auditLogRepository.findAll();
        String targetTenant = payload.get("targetTenant");
        boolean allowed = userDetails.getTenantId() != null && userDetails.getTenantId().equals(targetTenant);
        Map<String, Object> response = new HashMap<>();
        response.put("allowed", allowed);
        response.put("reason", allowed ? "Claim matches target tenant" : "Tenant mismatch");
        return ResponseEntity.ok(response);
    }

    @GetMapping("/notifications/stream")
    public SseEmitter streamNotifications(@AuthenticationPrincipal CustomUserDetails userDetails) {
        auditLogRepository.findAll();
        // Return emitter immediately. Connection is handled asynchronously by SseEmitter without blocking request thread.
        return sseConnectionManager.createConnection(userDetails);
    }
}
