package com.verdantiq.gateway.dept;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DeptDashboardData {
    private int pendingVerifications;
    private int activeEscalations;
    private int totalStudents;
    private double overallEnergySavedKwh;
}
