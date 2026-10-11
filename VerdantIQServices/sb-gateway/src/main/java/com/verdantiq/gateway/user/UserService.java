package com.verdantiq.gateway.user;

import com.verdantiq.gateway.common.security.CustomUserDetails;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserService {

    @Autowired
    private HouseholdRepository householdRepository;
    
    @Autowired
    private ActivityLogRepository activityLogRepository;
    
    @Autowired
    private UserReportRepository userReportRepository;
    
    @Autowired
    private RewardItemRepository rewardItemRepository;
    
    @Autowired
    private UserGoalRepository userGoalRepository;

    @Autowired
    private LinkedDeviceRepository linkedDeviceRepository;

    private String getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        return userDetails.getUid();
    }

    public UserDashboardMetrics getDashboard() {
        String uid = getCurrentUserId();
        String tenantId = ((CustomUserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getTenantId();
        List<ActivityLog> logs = activityLogRepository.findByHouseholdIdAndTenantId(uid, tenantId);
        
        double monthlyKwh = 0.0;
        double monthlyCarbonKg = 0.0;
        double monthlySavingsUSD = 0.0;
        int ecoPoints = 0;
        int activeOptimizations = 0;
        
        for (ActivityLog log : logs) {
            monthlyKwh += log.getKwhSaved();
            monthlyCarbonKg += log.getCarbonKgSaved();
            monthlySavingsUSD += log.getSavingsUSD();
            ecoPoints += log.getEcoPointsEarned();
            if ("optimization".equalsIgnoreCase(log.getType())) {
                activeOptimizations++;
            }
        }
        
        String rankTitle = "Novice";
        if (ecoPoints > 1000) rankTitle = "Eco Champion";
        else if (ecoPoints > 500) rankTitle = "Eco Warrior";
        
        return new UserDashboardMetrics(
                monthlyKwh,
                monthlyCarbonKg,
                monthlySavingsUSD,
                ecoPoints,
                rankTitle,
                activeOptimizations
        );
    }

    public DigitalTwinHouse getDigitalTwin() {
        String uid = getCurrentUserId();
        return householdRepository.findById(uid).orElse(null);
    }

    public DigitalTwinHouse updateDigitalTwin(DigitalTwinHouse updatedHouse) {
        String uid = getCurrentUserId();
        if (updatedHouse.getId() != null && !updatedHouse.getId().equals(uid)) {
            throw new org.springframework.security.access.AccessDeniedException("Cannot update digital twin for a different household");
        }
        updatedHouse.setId(uid); // ensure scoped to own id
        return householdRepository.save(updatedHouse);
    }

    public List<LinkedDevice> getDevices() {
        return linkedDeviceRepository.findByHouseholdId(getCurrentUserId());
    }
    
    public List<UserReport> getReports() {
        return userReportRepository.findByHouseholdId(getCurrentUserId());
    }

    public List<RewardItem> getRewards() {
        return rewardItemRepository.findByHouseholdId(getCurrentUserId());
    }

    public List<ActivityLog> getHistory() {
        return activityLogRepository.findByHouseholdId(getCurrentUserId());
    }

    public List<UserGoal> getGoals() {
        return userGoalRepository.findByHouseholdId(getCurrentUserId());
    }

    public List<UserGoal> updateGoals(List<UserGoal> goals) {
        String uid = getCurrentUserId();
        // ensure scoping for all incoming goals
        for (UserGoal goal : goals) {
            if (goal.getId() != null) {
                UserGoal existing = userGoalRepository.findById(goal.getId()).orElse(null);
                if (existing != null && !uid.equals(existing.getHouseholdId())) {
                    throw new org.springframework.security.access.AccessDeniedException("Cannot update goal belonging to another household");
                }
            }
            goal.setHouseholdId(uid);
        }
        return userGoalRepository.saveAll(goals);
    }
}
