package com.verdantiq.gateway.audit;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Document(collection = "AuditLogs")
public class AuditLog {

    @Id
    private String id;
    
    private String uid;
    private String userEmail;
    private String userRole;
    private String tenantId;
    
    private String action;
    private String resourceType;
    private String resourceId;
    private String details;
    
    @CreatedDate
    private Instant createdAt;

    public AuditLog() {
    }

    public AuditLog(String uid, String userEmail, String userRole, String tenantId, String action, String resourceType, String resourceId, String details) {
        this.uid = uid;
        this.userEmail = userEmail;
        this.userRole = userRole;
        this.tenantId = tenantId;
        this.action = action;
        this.resourceType = resourceType;
        this.resourceId = resourceId;
        this.details = details;
    }

    public String getId() { return id; }
    public String getUid() { return uid; }
    public String getUserEmail() { return userEmail; }
    public String getUserRole() { return userRole; }
    public String getTenantId() { return tenantId; }
    public String getAction() { return action; }
    public String getResourceType() { return resourceType; }
    public String getResourceId() { return resourceId; }
    public String getDetails() { return details; }
    public Instant getCreatedAt() { return createdAt; }
}
