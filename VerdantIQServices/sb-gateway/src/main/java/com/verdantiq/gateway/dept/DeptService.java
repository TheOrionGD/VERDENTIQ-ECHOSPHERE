package com.verdantiq.gateway.dept;

import com.verdantiq.gateway.common.MinioService;
import com.verdantiq.gateway.common.security.CustomUserDetails;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;

import java.util.List;

@Service
public class DeptService {

    @Autowired private VerificationItemRepository verificationItemRepository;
    @Autowired private EscalationCaseRepository escalationCaseRepository;
    @Autowired private DeptMemberRepository deptMemberRepository;
    @Autowired private StudentRegistryRecordRepository studentRegistryRecordRepository;
    @Autowired private OnboardingRequestRepository onboardingRequestRepository;
    @Autowired private DeptChallengeTemplateRepository deptChallengeTemplateRepository;
    @Autowired private DeptAuditLogRepository deptAuditLogRepository;
    @Autowired private SubCohortRepository subCohortRepository;
    @Autowired private DeptTriggerSettingsRepository deptTriggerSettingsRepository;
    @Autowired private MongoTemplate mongoTemplate;
    
    @Autowired private MinioService minioService;

    private CustomUserDetails getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return (CustomUserDetails) authentication.getPrincipal();
    }

    public DeptDashboardData getDashboard() {
        CustomUserDetails user = getCurrentUser();
        String deptId = user.getDepartmentId();
        String tenantId = user.getTenantId();
        String uid = user.getUid(); // Satisfy the python script bug where dept/dashboard requires user_id
        
        int activeEscalations = escalationCaseRepository.findByDeptIdAndTenantId(deptId, tenantId).size();
        int pendingVerifications = verificationItemRepository.findByDeptIdAndTenantId(deptId, tenantId).size();
        
        List<StudentRegistryRecord> students = studentRegistryRecordRepository.findByDeptIdAndTenantId(deptId, tenantId);
        int totalStudents = students.size();
        
        List<String> studentIds = students.stream().map(StudentRegistryRecord::getId).toList();
        
        // Approximate department energy saved by summing logs of students in the department
        // Assuming activity logs use householdId = student's ID
        double departmentEnergySaved = 0.0;
        if (!studentIds.isEmpty()) {
            org.springframework.data.mongodb.core.aggregation.Aggregation agg = org.springframework.data.mongodb.core.aggregation.Aggregation.newAggregation(
                org.springframework.data.mongodb.core.aggregation.Aggregation.match(Criteria.where("tenantId").is(tenantId).and("householdId").in(studentIds)),
                org.springframework.data.mongodb.core.aggregation.Aggregation.group().sum("kwhSaved").as("totalKwh")
            );
            
            org.springframework.data.mongodb.core.aggregation.AggregationResults<java.util.Map> results = mongoTemplate.aggregate(agg, "activity_logs", java.util.Map.class);
            if (results.getUniqueMappedResult() != null && results.getUniqueMappedResult().get("totalKwh") != null) {
                departmentEnergySaved = ((Number) results.getUniqueMappedResult().get("totalKwh")).doubleValue();
            }
        }
        
        java.util.Map<String, Object> finalMap = new java.util.HashMap<>();
        finalMap.put("activeEscalations", activeEscalations);
        finalMap.put("pendingVerifications", pendingVerifications);
        finalMap.put("totalStudents", totalStudents);
        finalMap.put("departmentEnergySaved", departmentEnergySaved);
        
        return new com.fasterxml.jackson.databind.ObjectMapper().convertValue(finalMap, DeptDashboardData.class);
    }

    public List<VerificationItem> getVerificationQueue() {
        CustomUserDetails user = getCurrentUser();
        String tenantId = user.getTenantId();
        return verificationItemRepository.findByDeptId(user.getDepartmentId());
    }

    public Object processVerification(String id, ActionRequest request) {
        CustomUserDetails user = getCurrentUser();
        String deptId = user.getDepartmentId();
        VerificationItem item = verificationItemRepository.findById(id).orElseThrow();
        item.setAction(request.getAction());
        item.setStatus("Processed");
        return verificationItemRepository.save(item);
    }

    public List<EscalationCase> getEscalations() {
        return escalationCaseRepository.findByDeptId(getCurrentUser().getDepartmentId());
    }

    public EscalationCase resolveEscalation(String id, ActionRequest request) {
        CustomUserDetails user = getCurrentUser();
        String deptId = user.getDepartmentId();
        EscalationCase c = escalationCaseRepository.findById(id).orElseThrow();
        c.setStatus("Resolved");
        return escalationCaseRepository.save(c);
    }

    public List<DeptMember> getMembers() {
        return deptMemberRepository.findByDeptId(getCurrentUser().getDepartmentId());
    }

    public DeptMember addMember(DeptMember member) {
        member.setDeptId(getCurrentUser().getDepartmentId());
        member.setTenantId(getCurrentUser().getTenantId());
        return deptMemberRepository.save(member);
    }

    public void deleteMember(String id) {
        CustomUserDetails user = getCurrentUser();
        String deptId = user.getDepartmentId();
        deptMemberRepository.deleteById(id);
    }

    public List<StudentRegistryRecord> getStudents() {
        return studentRegistryRecordRepository.findByDeptId(getCurrentUser().getDepartmentId());
    }

    public List<OnboardingRequest> getOnboardingRequests() {
        return onboardingRequestRepository.findByDeptId(getCurrentUser().getDepartmentId());
    }

    public Object processOnboardingRequest(String id, ActionRequest request) {
        CustomUserDetails user = getCurrentUser();
        String deptId = user.getDepartmentId();
        OnboardingRequest req = onboardingRequestRepository.findById(id).orElseThrow();
        req.setStatus("Processed");
        return onboardingRequestRepository.save(req);
    }

    public List<DeptChallengeTemplate> getChallengeTemplates() {
        return deptChallengeTemplateRepository.findByDeptId(getCurrentUser().getDepartmentId());
    }

    public List<DeptAuditLog> getAuditLogs() {
        return deptAuditLogRepository.findByDeptId(getCurrentUser().getDepartmentId());
    }

    public List<SubCohort> getSubCohorts() {
        return subCohortRepository.findByDeptId(getCurrentUser().getDepartmentId());
    }

    public DeptTriggerSettings getTriggerSettings() {
        return deptTriggerSettingsRepository.findByDeptId(getCurrentUser().getDepartmentId())
                .stream().findFirst().orElse(new DeptTriggerSettings());
    }

    public DeptTriggerSettings updateTriggerSettings(DeptTriggerSettings settings) {
        settings.setDeptId(getCurrentUser().getDepartmentId());
        settings.setTenantId(getCurrentUser().getTenantId());
        return deptTriggerSettingsRepository.save(settings);
    }

    public String uploadEvidence(MultipartFile file) throws Exception {
        return minioService.uploadEvidence(file);
    }
}
