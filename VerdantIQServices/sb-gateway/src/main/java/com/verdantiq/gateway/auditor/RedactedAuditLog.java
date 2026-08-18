package com.verdantiq.gateway.auditor;

import com.verdantiq.gateway.audit.AuditLog;
import lombok.Data;

@Data
public class RedactedAuditLog {
    private String id;
    private String userId; // Always "REDACTED"
    private String username; // Always "REDACTED"
    private String role;
    private String tenantId;
    private String action;
    private String resourceType;
    private String resourceId;
    private String details; // Cleaned

    public RedactedAuditLog(AuditLog rawLog) {
        this.id = rawLog.getId();
        this.userId = "REDACTED";
        this.username = "REDACTED";
        this.role = rawLog.getUserRole();
        this.tenantId = rawLog.getTenantId();
        this.action = rawLog.getAction();
        this.resourceType = rawLog.getResourceType();
        this.resourceId = rawLog.getResourceId();
        
        // Advanced redaction: strip anything resembling args/parameters in the details string
        if (rawLog.getDetails() != null && rawLog.getDetails().contains("Args:")) {
            this.details = rawLog.getDetails().substring(0, rawLog.getDetails().indexOf("Args:")) + "[ARGS REDACTED]";
        } else {
            this.details = rawLog.getDetails();
        }
    }
}
