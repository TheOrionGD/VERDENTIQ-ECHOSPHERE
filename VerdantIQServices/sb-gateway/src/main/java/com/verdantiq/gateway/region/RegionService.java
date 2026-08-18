package com.verdantiq.gateway.region;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class RegionService {

    @Autowired private InstitutionRecordRepository institutionRecordRepository;
    @Autowired private HouseholdRecordRepository householdRecordRepository;
    @Autowired private TenantRequestRepository tenantRequestRepository;
    @Autowired private SharedChallengeTemplateRepository sharedChallengeTemplateRepository;
    @Autowired private DomainOversightRecordRepository domainOversightRecordRepository;
    @Autowired private SupportTicketRepository supportTicketRepository;
    @Autowired private RegionalPolicyConfigRepository regionalPolicyConfigRepository;
    @Autowired private GrowthTrendDataPointRepository growthTrendDataPointRepository;
    @Autowired private RegionalBenchmarkRepository regionalBenchmarkRepository;
    
    @Autowired private StateAggregationService stateAggregationService;

    public List<InstitutionRecord> getInstitutions(String regionId) {
        return institutionRecordRepository.findByRegionId(regionId);
    }

    public List<InstitutionRecord> getInstitutionsByState(String stateId) {
        return institutionRecordRepository.findByStateId(stateId);
    }

    public InstitutionRecord addInstitution(InstitutionRecord record) {
        return institutionRecordRepository.save(record);
    }

    public InstitutionRecord updateInstitutionStatus(String id, String status) {
        InstitutionRecord rec = institutionRecordRepository.findById(id).orElseThrow();
        rec.setStatus(status);
        return institutionRecordRepository.save(rec);
    }

    public InstitutionRecord flagInstitutionSupport(String id, SupportFlagRequest request) {
        InstitutionRecord rec = institutionRecordRepository.findById(id).orElseThrow();
        // stub update
        return institutionRecordRepository.save(rec);
    }

    public List<HouseholdAggregateRecord> getHouseholdsAggregate(String stateId) {
        // MUST NEVER return raw HouseholdRecord list.
        List<HouseholdRecord> records = householdRecordRepository.findByStateId(stateId);
        return records.stream().map(r -> new HouseholdAggregateRecord(
                r.getId(),
                r.getStateId(),
                r.getDistrictId(),
                r.getRegisteredAt(),
                r.getStatus()
        )).collect(Collectors.toList());
    }

    public HouseholdRecord registerHousehold(HouseholdRecord record) {
        record.setRegisteredAt(Instant.now().toString());
        record.setStatus("active");
        return householdRecordRepository.save(record);
    }

    public StateAggregateResult getStateAggregate(String stateId) {
        institutionRecordRepository.findAll();
        return stateAggregationService.getAggregateForState(stateId);
    }

    public List<TenantRequest> getTenantRequests() {
        return tenantRequestRepository.findAll(); // Simplified for stub
    }

    public TenantRequest approveTenantRequest(String requestId) {
        TenantRequest req = tenantRequestRepository.findById(requestId).orElseThrow();
        req.setStatus("Approved");
        return tenantRequestRepository.save(req);
    }

    public TenantRequest rejectTenantRequest(String requestId) {
        TenantRequest req = tenantRequestRepository.findById(requestId).orElseThrow();
        req.setStatus("Rejected");
        return tenantRequestRepository.save(req);
    }

    public List<SharedChallengeTemplate> getChallengeTemplates() {
        return sharedChallengeTemplateRepository.findAll();
    }

    public SharedChallengeTemplate createChallengeTemplate(SharedChallengeTemplate template) {
        return sharedChallengeTemplateRepository.save(template);
    }

    public List<DomainOversightRecord> getDomains() {
        return domainOversightRecordRepository.findAll();
    }

    public List<SupportTicket> getSupportTickets() {
        return supportTicketRepository.findAll();
    }

    public SupportTicket addSupportTicketRecommendation(String ticketId, String recommendation) {
        SupportTicket ticket = supportTicketRepository.findById(ticketId).orElseThrow();
        // stub add
        return supportTicketRepository.save(ticket);
    }

    public RegionalPolicyConfig getPolicyConfig() {
        return regionalPolicyConfigRepository.findAll().stream().findFirst().orElse(new RegionalPolicyConfig());
    }

    public RegionalPolicyConfig updatePolicyConfig(RegionalPolicyConfig config) {
        return regionalPolicyConfigRepository.save(config);
    }

    public List<GrowthTrendDataPoint> getGrowthTrend() {
        return growthTrendDataPointRepository.findAll();
    }

    public List<RegionalBenchmark> getBenchmarks() {
        return regionalBenchmarkRepository.findAll();
    }
}
