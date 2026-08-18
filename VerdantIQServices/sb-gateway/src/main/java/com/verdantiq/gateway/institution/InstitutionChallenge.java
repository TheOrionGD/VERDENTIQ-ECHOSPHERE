package com.verdantiq.gateway.institution;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "$(InstitutionChallenge.ToLower())s")
public class InstitutionChallenge {
    @Id
    private String id;
    
    @Indexed
    private String tenantId;
    
    // Stub fields
    private String name;
}
