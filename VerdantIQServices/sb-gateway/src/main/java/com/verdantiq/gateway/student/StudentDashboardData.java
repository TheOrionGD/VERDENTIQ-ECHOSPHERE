package com.verdantiq.gateway.student;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StudentDashboardData {
    private double currentUsageKwh;
    private double usageTargetKwh;
    private int rankingInDorm;
    private int totalEcoPoints;
}
