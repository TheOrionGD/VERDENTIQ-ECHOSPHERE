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
@Document(collection = "householdrecords")
public class HouseholdRecord {
    @Id
    private String id;
    
    private String name;
    private String email;
    
    @Indexed
    private String stateId;
    
    private String districtId;
    private String address;
    private String registeredAt;
    private String status;
}
