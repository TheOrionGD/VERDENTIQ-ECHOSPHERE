package com.verdantiq.gateway.region;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "tenantrequests")
public class TenantRequest {
    @Id
    private String id;
    
    @Indexed
    private String regionId;
    
    @Indexed
    private String stateId;
    
    private String institutionName;
    private String applicantName;
    private String applicantEmail;
    private String domainRequested;
    private String regionDistrict;
    private Integer estimatedStudents;
    private String accreditationDoc;
    private String status;
    private String submittedAt;
    private String notes;
    private java.util.List<String> springBootLog;
}

