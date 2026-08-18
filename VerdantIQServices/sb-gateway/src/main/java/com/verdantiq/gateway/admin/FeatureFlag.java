package com.verdantiq.gateway.admin;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "$(FeatureFlag.ToLower())s")
public class FeatureFlag {
    @Id
    private String id;
    
    // Stub field
    private String name;
}
