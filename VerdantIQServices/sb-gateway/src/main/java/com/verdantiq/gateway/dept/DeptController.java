package com.verdantiq.gateway.dept;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import com.verdantiq.gateway.audit.AuditableWrite;

import java.util.List;

@RestController
@RequestMapping("/api/v1/dept")
@PreAuthorize("hasRole('DEPT_ADMIN')")
public class DeptController {

    @Autowired
    private DeptService deptService;

    @GetMapping("/dashboard")
    @PreAuthorize("hasRole('DEPARTMENT_ADMIN')")
    public ResponseEntity<DeptDashboardData> getDashboard() {
        return ResponseEntity.ok(deptService.getDashboard());
    }

    @GetMapping("/verification-queue")
    public ResponseEntity<List<VerificationItem>> getVerificationQueue() {
        return ResponseEntity.ok(deptService.getVerificationQueue());
    }

    @AuditableWrite(action = "PROCESS", resourceType = "VerificationItem")
    @PostMapping("/verification-queue/{id}/process") public ResponseEntity<?> processVerification(@PathVariable String id, @RequestBody ActionRequest request) {
        return ResponseEntity.ok(deptService.processVerification(id, request));
    }

    @GetMapping("/escalations")
    public ResponseEntity<List<EscalationCase>> getEscalations() {
        return ResponseEntity.ok(deptService.getEscalations());
    }

    @AuditableWrite(action = "RESOLVE", resourceType = "EscalationCase")
    @PostMapping("/escalations/{id}/resolve") public ResponseEntity<EscalationCase> resolveEscalation(@PathVariable String id, @RequestBody ActionRequest request) {
        return ResponseEntity.ok(deptService.resolveEscalation(id, request));
    }

    @GetMapping("/members")
    public ResponseEntity<List<DeptMember>> getMembers() {
        return ResponseEntity.ok(deptService.getMembers());
    }

    @PostMapping("/members")
    public ResponseEntity<DeptMember> addMember(@RequestBody DeptMember member) {
        return ResponseEntity.ok(deptService.addMember(member));
    }

    @AuditableWrite(action = "DELETE", resourceType = "DeptMember")
    @DeleteMapping("/members/{id}") public ResponseEntity<?> deleteMember(@PathVariable String id) {
        deptService.deleteMember(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/students")
    public ResponseEntity<List<StudentRegistryRecord>> getStudents() {
        return ResponseEntity.ok(deptService.getStudents());
    }

    @GetMapping("/onboarding-requests")
    public ResponseEntity<List<OnboardingRequest>> getOnboardingRequests() {
        return ResponseEntity.ok(deptService.getOnboardingRequests());
    }

    @AuditableWrite(action = "PROCESS", resourceType = "OnboardingRequest")
    @PostMapping("/onboarding-requests/{id}/process") public ResponseEntity<?> processOnboardingRequest(@PathVariable String id, @RequestBody ActionRequest request) {
        return ResponseEntity.ok(deptService.processOnboardingRequest(id, request));
    }

    @GetMapping("/challenge-templates")
    public ResponseEntity<List<DeptChallengeTemplate>> getChallengeTemplates() {
        return ResponseEntity.ok(deptService.getChallengeTemplates());
    }

    @GetMapping("/audit-logs")
    public ResponseEntity<List<DeptAuditLog>> getAuditLogs() {
        return ResponseEntity.ok(deptService.getAuditLogs());
    }

    @GetMapping("/sub-cohorts")
    public ResponseEntity<List<SubCohort>> getSubCohorts() {
        return ResponseEntity.ok(deptService.getSubCohorts());
    }

    @GetMapping("/trigger-settings")
    public ResponseEntity<DeptTriggerSettings> getTriggerSettings() {
        return ResponseEntity.ok(deptService.getTriggerSettings());
    }

    @PutMapping("/trigger-settings")
    public ResponseEntity<DeptTriggerSettings> updateTriggerSettings(@RequestBody DeptTriggerSettings settings) {
        return ResponseEntity.ok(deptService.updateTriggerSettings(settings));
    }

    @PostMapping("/evidence/upload")
    public ResponseEntity<String> uploadEvidence(@RequestParam("file") MultipartFile file) throws Exception {
        return ResponseEntity.ok(deptService.uploadEvidence(file));
    }
}
