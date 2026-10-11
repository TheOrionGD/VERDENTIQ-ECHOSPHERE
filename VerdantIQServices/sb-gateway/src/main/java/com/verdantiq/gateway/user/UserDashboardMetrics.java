package com.verdantiq.gateway.user;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserDashboardMetrics {
    private double monthlyKwh;
    private double monthlyCarbonKg;
    private double monthlySavingsUSD;
    private int ecoPoints;
    private String rankTitle;
    private int activeOptimizationCount;
}
