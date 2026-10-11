package com.verdantiq.gateway.region;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StateAggregateResult {
    private String stateId;
    private int institutionCount;
    private int householdCount;
    private double totalEnergySavingsKwh;
    private double totalCarbonOffsetKg;
    private double aggregateEUI;
    private String status;
    private String notice;
}
