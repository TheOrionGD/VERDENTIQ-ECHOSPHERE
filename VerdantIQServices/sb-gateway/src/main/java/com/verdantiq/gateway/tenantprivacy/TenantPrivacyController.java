package com.verdantiq.gateway.tenantprivacy;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/tenant-privacy")
public class TenantPrivacyController {

    @Autowired
    private TenantPrivacyService tenantPrivacyService;

    @GetMapping("/check")
    public ResponseEntity<Map<String, Object>> checkTenantPrivacy(@RequestParam String tenantId) {
        return ResponseEntity.ok(tenantPrivacyService.checkTenantPrivacy(tenantId));
    }

    @PostMapping("/verify-access")
    public ResponseEntity<Map<String, Object>> verifyAccess(@RequestBody VerifyAccessRequest request) {
        return ResponseEntity.ok(tenantPrivacyService.verifyAccess(request.getUserRole(), request.getTargetTenant()));
    }

    public static class VerifyAccessRequest {
        private String userRole;
        private String targetTenant;

        public String getUserRole() {
            return userRole;
        }

        public void setUserRole(String userRole) {
            this.userRole = userRole;
        }

        public String getTargetTenant() {
            return targetTenant;
        }

        public void setTargetTenant(String targetTenant) {
            this.targetTenant = targetTenant;
        }
    }
}
