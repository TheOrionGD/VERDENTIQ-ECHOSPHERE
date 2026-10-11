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
    private String id; // Database User ID (usr_<uuid>)

    @Indexed(unique = true)
    private String email;

    private String name;

    private String passwordHash;
    
    private String role;
    
    @Indexed
    private String tenantId;
    
    @Indexed
    private String departmentId;

    private String createdAt;
    private String updatedAt;
}
