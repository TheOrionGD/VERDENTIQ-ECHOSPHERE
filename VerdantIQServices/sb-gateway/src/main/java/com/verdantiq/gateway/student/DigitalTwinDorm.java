package com.verdantiq.gateway.student;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "$(DigitalTwinDorm.ToLower())s")
public class DigitalTwinDorm {
    @Id
    private String id;
    
    @Indexed
    private String tenantId;
    
    @Indexed
    private String deptId;
    
    @Indexed
    private String uid;
}
