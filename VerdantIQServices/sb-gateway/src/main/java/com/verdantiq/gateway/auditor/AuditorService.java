package com.verdantiq.gateway.auditor;

import com.verdantiq.gateway.audit.AuditLog;
import com.verdantiq.gateway.audit.AuditLogRepository;
import com.verdantiq.gateway.region.DomainOversightRecord;
import com.verdantiq.gateway.region.DomainOversightRecordRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AuditorService {

    @Autowired
    private AuditLogRepository auditLogRepository;

    @Autowired
    private AuditRequestRepository auditRequestRepository;

    @Autowired
    private DomainOversightRecordRepository domainOversightRecordRepository;

    @Autowired
    private DataFlowNodeRepository dataFlowNodeRepository;

    @Autowired
    private TenantHistoryEntryRepository tenantHistoryEntryRepository;

    public OverviewStats getOverview() {
        long totalLogs = auditLogRepository.findAll().size();
        long activeAudits = 5;
        long flaggedAnomalies = 12;
        
        java.util.Map<String, Object> finalMap = java.util.Map.of(
            "totalLogs", totalLogs,
            "activeAudits", activeAudits,
            "flaggedAnomalies", flaggedAnomalies,
            "complianceScore", 99.4,
            "activeDomains", 12850
        );
        
        return new com.fasterxml.jackson.databind.ObjectMapper().convertValue(finalMap, OverviewStats.class);
    }

    public List<RedactedAuditLog> getRedactedLogs() {
        List<AuditLog> rawLogs = auditLogRepository.findAll();
        // Structural privacy enforcement: Map everything via the Redacted DTO
        return rawLogs.stream().map(RedactedAuditLog::new).collect(Collectors.toList());
    }

    public List<AuditRequest> getRequests() {
        return auditRequestRepository.findAll();
    }

    public List<DomainOversightRecord> getDomains() {
        return domainOversightRecordRepository.findAll();
    }

    public List<DataFlowNode> getDataFlow() {
        return dataFlowNodeRepository.findAll();
    }

    public List<TenantHistoryEntry> getTenantHistory() {
        return tenantHistoryEntryRepository.findAll();
    }

    @Autowired
    private ExportConfigRepository exportConfigRepository;

    @Autowired
    private AuditSettingsRepository auditSettingsRepository;

    public ExportConfig getExportConfig() {
        return exportConfigRepository.findAll().stream().findFirst().orElse(new ExportConfig("JSON", "Strict"));
    }

    public AuditSettings getSettings() {
        return auditSettingsRepository.findAll().stream().findFirst().orElse(new AuditSettings(365, true));
    }
}
