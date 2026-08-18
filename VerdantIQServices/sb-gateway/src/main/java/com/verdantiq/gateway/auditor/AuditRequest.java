package com.verdantiq.gateway.auditor;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "$(AuditRequest.ToLower())s")
public class AuditRequest {
    @Id
    private String id;
    
    // Stub field
    private String name;
}
