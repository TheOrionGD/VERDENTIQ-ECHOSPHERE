package com.verdantiq.gateway.common;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "$(ActivityHistoryItem.ToLower())s")
public class ActivityHistoryItem {
    @Id
    private String id;
    
    // Stub field
    private String tenantId;
    private String title;
    private boolean read;
}
