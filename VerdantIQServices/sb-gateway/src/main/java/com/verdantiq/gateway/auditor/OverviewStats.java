package com.verdantiq.gateway.auditor;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OverviewStats {
    private int totalLogs;
    private double complianceRate;
    private int verifiedChainLength;
}
