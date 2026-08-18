package com.verdantiq.gateway.admin;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "accessgrants")
public class AccessGrant {
    @Id
    private String id;
    private String granteeId;
    private String role;
    
    @Indexed(expireAfterSeconds = 0)
    private Date expiresAt;
}
