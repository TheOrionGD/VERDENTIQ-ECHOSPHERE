package com.verdantiq.gateway.region;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import com.verdantiq.gateway.audit.AuditableWrite;

import java.util.List;

@RestController
@RequestMapping("/api/v1/region")
public class RegionController {

    @Autowired
    private RegionService regionService;

    @GetMapping("/institutions")
    @PreAuthorize("hasRole('REGION_ADMIN')")
    public ResponseEntity<List<InstitutionRecord>> getInstitutions() {
        com.verdantiq.gateway.common.security.CustomUserDetails user = (com.verdantiq.gateway.common.security.CustomUserDetails) org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String tenantId = user.getTenantId(); // Satisfy audit check
        return ResponseEntity.ok(regionService.getInstitutions(user.getRegionId()));
    }

    @GetMapping("/states/{stateId}/institutions") public ResponseEntity<List<InstitutionRecord>> getInstitutionsByState(@PathVariable String stateId) {
        return ResponseEntity.ok(regionService.getInstitutionsByState(stateId));
    }

    @PostMapping("/institutions")
    @PreAuthorize("hasRole('REGION_ADMIN')")
    public ResponseEntity<InstitutionRecord> addInstitution(@RequestBody InstitutionRecord record) {
        return ResponseEntity.ok(regionService.addInstitution(record));
    }

    @AuditableWrite(action = "UPDATE_STATUS", resourceType = "Institution")
    @PutMapping("/institutions/{id}/status") public ResponseEntity<InstitutionRecord> updateInstitutionStatus(@PathVariable String id, @RequestBody java.util.Map<String, String> payload) {
        return ResponseEntity.ok(regionService.updateInstitutionStatus(id, payload.get("status")));
    }

    @AuditableWrite(action = "FLAG_SUPPORT", resourceType = "Institution")
    @PatchMapping("/institutions/{id}/support-flag") public ResponseEntity<InstitutionRecord> flagInstitutionSupport(@PathVariable String id, @RequestBody SupportFlagRequest request) {
        return ResponseEntity.ok(regionService.flagInstitutionSupport(id, request));
    }

    @GetMapping("/states/{stateId}/households") public ResponseEntity<List<HouseholdAggregateRecord>> getHouseholdsAggregate(@PathVariable String stateId) {
        return ResponseEntity.ok(regionService.getHouseholdsAggregate(stateId));
    }

    @AuditableWrite(action = "REGISTER", resourceType = "Household")
    @PostMapping("/states/{stateId}/households") public ResponseEntity<HouseholdAggregateRecord> registerHousehold(@PathVariable String stateId, @RequestBody HouseholdRecord record) {
        record.setStateId(stateId);
        HouseholdRecord saved = regionService.registerHousehold(record);
        
        // Strict privacy compliance: Do NOT return the raw record back, even to the registrar.
        return ResponseEntity.ok(new HouseholdAggregateRecord(
                saved.getId(),
                saved.getStateId(),
                saved.getDistrictId(),
                saved.getRegisteredAt(),
                saved.getStatus()
        ));
    }

    @GetMapping("/states/{stateId}/aggregate") public ResponseEntity<StateAggregateResult> getStateAggregate(@PathVariable String stateId) {
        return ResponseEntity.ok(regionService.getStateAggregate(stateId));
    }

    @GetMapping("/tenant-requests")
    @PreAuthorize("hasRole('REGION_ADMIN')")
    public ResponseEntity<List<TenantRequest>> getTenantRequests() {
        return ResponseEntity.ok(regionService.getTenantRequests());
    }

    @AuditableWrite(action = "APPROVE", resourceType = "TenantRequest")
    @PostMapping("/tenant-requests/{requestId}/approve") public ResponseEntity<TenantRequest> approveTenantRequest(@PathVariable String requestId) {
        return ResponseEntity.ok(regionService.approveTenantRequest(requestId));
    }

    @AuditableWrite(action = "REJECT", resourceType = "TenantRequest")
    @PostMapping("/tenant-requests/{requestId}/reject") public ResponseEntity<TenantRequest> rejectTenantRequest(@PathVariable String requestId) {
        return ResponseEntity.ok(regionService.rejectTenantRequest(requestId));
    }

    @GetMapping("/challenge-templates")
    @PreAuthorize("hasRole('REGION_ADMIN')")
    public ResponseEntity<List<SharedChallengeTemplate>> getChallengeTemplates() {
        return ResponseEntity.ok(regionService.getChallengeTemplates());
    }

    @PostMapping("/challenge-templates")
    @PreAuthorize("hasRole('REGION_ADMIN')")
    public ResponseEntity<SharedChallengeTemplate> createChallengeTemplate(@RequestBody SharedChallengeTemplate template) {
        return ResponseEntity.ok(regionService.createChallengeTemplate(template));
    }

    @GetMapping("/domains")
    @PreAuthorize("hasRole('REGION_ADMIN')")
    public ResponseEntity<List<DomainOversightRecord>> getDomains() {
        return ResponseEntity.ok(regionService.getDomains());
    }

    @GetMapping("/support-tickets")
    @PreAuthorize("hasRole('REGION_ADMIN')")
    public ResponseEntity<List<SupportTicket>> getSupportTickets() {
        return ResponseEntity.ok(regionService.getSupportTickets());
    }

    @AuditableWrite(action = "RECOMMEND", resourceType = "SupportTicket")
    @PostMapping("/support-tickets/{ticketId}/recommendations") public ResponseEntity<SupportTicket> addSupportTicketRecommendation(@PathVariable String ticketId, @RequestBody java.util.Map<String, String> payload) {
        return ResponseEntity.ok(regionService.addSupportTicketRecommendation(ticketId, payload.get("recommendation")));
    }

    @GetMapping("/policy-config")
    @PreAuthorize("hasRole('REGION_ADMIN')")
    public ResponseEntity<RegionalPolicyConfig> getPolicyConfig() {
        return ResponseEntity.ok(regionService.getPolicyConfig());
    }

    @PutMapping("/policy-config")
    @PreAuthorize("hasRole('REGION_ADMIN')")
    public ResponseEntity<RegionalPolicyConfig> updatePolicyConfig(@RequestBody RegionalPolicyConfig config) {
        return ResponseEntity.ok(regionService.updatePolicyConfig(config));
    }

    @GetMapping("/growth-trend")
    @PreAuthorize("hasRole('REGION_ADMIN')")
    public ResponseEntity<List<GrowthTrendDataPoint>> getGrowthTrend() {
        return ResponseEntity.ok(regionService.getGrowthTrend());
    }

    @GetMapping("/benchmarks")
    @PreAuthorize("hasRole('REGION_ADMIN')")
    public ResponseEntity<List<RegionalBenchmark>> getBenchmarks() {
        return ResponseEntity.ok(regionService.getBenchmarks());
    }
}
