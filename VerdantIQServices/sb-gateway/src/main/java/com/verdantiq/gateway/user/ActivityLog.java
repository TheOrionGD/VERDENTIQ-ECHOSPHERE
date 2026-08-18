package com.verdantiq.gateway.user;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "activity_logs")
public class ActivityLog {
    @Id
    private String id;
    
    @Indexed
    private String householdId;
    
    @Indexed
    private String tenantId;
    
    private Instant timestamp;
    private double kwhSaved;
    private double carbonKgSaved;
    private double savingsUSD;
    private int ecoPointsEarned;
    private String type; // e.g., "optimization", "manual_override"
}
