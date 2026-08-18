package com.verdantiq.gateway.admin;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "$(RBACSchemaRole.ToLower())s")
public class RBACSchemaRole {
    @Id
    private String id;
    
    // Stub field
    private String name;
}
