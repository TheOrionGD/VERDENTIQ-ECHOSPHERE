package com.verdantiq.gateway.common;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.stereotype.Component;
import org.bson.Document;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Arrays;

@Component
public class TestFixtureSeeder {

    @Autowired
    private MongoTemplate mongoTemplate;

    public void seedStandardUser() {
        // DigitalTwinHouse
        Document twin = new Document("_id", "hh-dt-101")
                .append("householdId", "hh-101")
                .append("estMonthlySavingsUSD", 85.0);
        mongoTemplate.save(twin, "digital_twins");

        // Activity Logs (14 days)
        Instant now = Instant.now();
        for (int i = 0; i < 14; i++) {
            Document log = new Document("householdId", "hh-101")
                    .append("timestamp", now.minus(i, ChronoUnit.DAYS))
                    .append("kwhSaved", 12.5)
                    .append("tenantId", "tenant-none");
            mongoTemplate.save(log, "activity_logs");
        }
    }

    public void seedStudent() {
        Document log = new Document("householdId", "dorm-202")
                .append("timestamp", Instant.now())
                .append("kwhSaved", 5.0)
                .append("tenantId", "inst-cmu-01");
        mongoTemplate.save(log, "activity_logs");
    }

    public void seedDepartmentModerator() {
        Document escalation = new Document("_id", "esc-1")
                .append("deptId", "dept-cs-01")
                .append("tenantId", "inst-cmu-01")
                .append("status", "pending");
        mongoTemplate.save(escalation, "escalations");
    }

    public void seedInstitutionAdmin() {
        Document inst = new Document("_id", "inst-cmu-01")
                .append("name", "CMU");
        mongoTemplate.save(inst, "institutions");
    }

    public void seedRegionalAdmin() {
        Document req = new Document("_id", "req-1")
                .append("regionId", "US-CA")
                .append("status", "pending");
        mongoTemplate.save(req, "tenant_requests");
    }

    public void seedPlatformAdmin() {
        Document log = new Document("_id", "audit-1")
                .append("action", "SYSTEM_START");
        mongoTemplate.save(log, "admin_audit_logs");
    }

    public void seedMLOpsAdmin() {
        // Covered in ml-gateway for registry
    }

    public void seedAuditor() {
        // Read only
    }

    public void seedAll() {
        tearDownAll();
        seedInstitutionAdmin();
        seedDepartmentModerator();
        seedStandardUser();
        seedStudent();
        seedRegionalAdmin();
        seedPlatformAdmin();
        seedMLOpsAdmin();
        seedAuditor();
    }

    public void tearDownAll() {
        mongoTemplate.getDb().drop();
    }
}
