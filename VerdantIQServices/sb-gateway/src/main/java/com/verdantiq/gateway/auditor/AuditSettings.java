package com.verdantiq.gateway.auditor;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuditSettings {
    private int auditRetentionDays;
    private boolean strictMode;
}
