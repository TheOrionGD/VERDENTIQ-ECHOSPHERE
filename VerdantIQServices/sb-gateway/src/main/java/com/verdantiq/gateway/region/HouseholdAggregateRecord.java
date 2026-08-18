package com.verdantiq.gateway.region;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class HouseholdAggregateRecord {
    private String id;
    private String stateId;
    private String districtId;
    private String registeredAt;
    private String status;
    // Specifically omitting name, email, address to comply with privacy contract
}
