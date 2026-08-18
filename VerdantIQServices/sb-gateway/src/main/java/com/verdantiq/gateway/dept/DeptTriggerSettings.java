package com.verdantiq.gateway.dept;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "$(DeptTriggerSettings.ToLower())s")
public class DeptTriggerSettings {
    @Id
    private String id;
    
    @Indexed
    private String tenantId;
    
    @Indexed
    private String deptId;
    
    // Stub fields for specific entities
    private String evidenceUrl; // For VerificationItem/EscalationCase pointing to MinIO
    private String action;
    private String status;
}
