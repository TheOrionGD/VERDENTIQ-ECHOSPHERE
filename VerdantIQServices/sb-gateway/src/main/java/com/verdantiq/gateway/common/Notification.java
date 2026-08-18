package com.verdantiq.gateway.common;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "$(Notification.ToLower())s")
public class Notification {
    @Id
    private String id;
    
    // Stub field
    private String tenantId;
    private String title;
    private boolean read;
    
    // Target scoping fields
    private String targetRole;
    private String targetDeptId;
    private String targetHouseholdId;
}
