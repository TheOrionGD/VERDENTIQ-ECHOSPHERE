package com.verdantiq.gateway.user;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "users")
public class User {

    @Id
    private String id; // uid from Firebase

    private String email;
    private String name;
    
    private String role;
    
    @Indexed
    private String tenantId;
    
    @Indexed
    private String departmentId;
}
