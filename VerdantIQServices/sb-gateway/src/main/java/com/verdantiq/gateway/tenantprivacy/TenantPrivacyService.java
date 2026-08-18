package com.verdantiq.gateway.tenantprivacy;

import com.verdantiq.gateway.common.security.CustomUserDetails;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class TenantPrivacyService {

    private CustomUserDetails getCurrentUserDetails() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof CustomUserDetails) {
            return (CustomUserDetails) authentication.getPrincipal();
        }
        return null;
    }

    public Map<String, Object> checkTenantPrivacy(String targetTenantId) {
        Map<String, Object> response = new HashMap<>();
        response.put("enabled", true);
        response.put("strictMode", true);
        response.put("tenantId", targetTenantId);
        return response;
    }

    public Map<String, Object> verifyAccess(String userRole, String targetTenant) {
        Map<String, Object> response = new HashMap<>();
        CustomUserDetails userDetails = getCurrentUserDetails();
        
        boolean hasAccess = false;
        
        if (userDetails != null) {
            String currentTenant = userDetails.getTenantId();
            
            // Allow access if tenants match, or if role is ADMIN/SUPER_ADMIN
            if (targetTenant != null && targetTenant.equals(currentTenant)) {
                hasAccess = true;
            } else if (userDetails.getAuthorities().stream().anyMatch(a -> a.getAuthority().contains("ADMIN"))) {
                hasAccess = true;
            }
        }
        
        response.put("hasAccess", hasAccess);
        response.put("targetTenant", targetTenant);
        return response;
    }
}
