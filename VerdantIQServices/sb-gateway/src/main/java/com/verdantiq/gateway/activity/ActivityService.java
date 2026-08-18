package com.verdantiq.gateway.activity;

import com.verdantiq.gateway.common.security.CustomUserDetails;
import com.verdantiq.gateway.user.ActivityLog;
import com.verdantiq.gateway.user.ActivityLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
public class ActivityService {

    @Autowired
    private ActivityLogRepository activityLogRepository;

    private String getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof CustomUserDetails) {
            return ((CustomUserDetails) authentication.getPrincipal()).getUid();
        }
        return "system";
    }

    private String getCurrentTenantId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof CustomUserDetails) {
            return ((CustomUserDetails) authentication.getPrincipal()).getTenantId();
        }
        return "default";
    }

    public List<ActivityLog> getActivityLogs() {
        String uid = getCurrentUserId();
        String tenantId = getCurrentTenantId();
        return activityLogRepository.findByHouseholdIdAndTenantId(uid, tenantId);
    }

    public ActivityLog logActivity(ActivityLog activity) {
        if (activity.getHouseholdId() == null) {
            activity.setHouseholdId(getCurrentUserId());
        }
        if (activity.getTenantId() == null) {
            activity.setTenantId(getCurrentTenantId());
        }
        if (activity.getTimestamp() == null) {
            activity.setTimestamp(Instant.now());
        }
        return activityLogRepository.save(activity);
    }
}
