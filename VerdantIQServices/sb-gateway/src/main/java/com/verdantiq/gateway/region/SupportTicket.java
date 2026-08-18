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
@Document(collection = "$(SupportTicket.ToLower())s")
public class SupportTicket {
    @Id
    private String id;
    
    @Indexed
    private String regionId;
    
    @Indexed
    private String stateId;
    
    // Stub field
    private String status;
}
