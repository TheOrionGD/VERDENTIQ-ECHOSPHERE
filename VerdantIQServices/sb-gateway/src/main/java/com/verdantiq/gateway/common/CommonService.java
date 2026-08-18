package com.verdantiq.gateway.common;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CommonService {

    @Autowired
    private ActivityHistoryItemRepository activityRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private SseConnectionManager sseConnectionManager;

    public List<ActivityHistoryItem> getActivity(String tenantId) {
        return activityRepository.findByTenantId(tenantId);
    }

    public ActivityHistoryItem logActivity(ActivityHistoryItem item, String tenantId) {
        item.setTenantId(tenantId);
        return activityRepository.save(item);
    }

    public List<Notification> getNotifications(String tenantId) {
        return notificationRepository.findByTenantId(tenantId);
    }

    public Notification addNotification(Notification notification, String tenantId) {
        notification.setTenantId(tenantId);
        Notification saved = notificationRepository.save(notification);
        
        // Dispatch real-time SSE
        sseConnectionManager.dispatchEvent(tenantId, saved);
        
        return saved;
    }

    public void markNotificationAsRead(String id, com.verdantiq.gateway.common.security.CustomUserDetails userDetails) {
        Notification notif = notificationRepository.findById(id).orElseThrow();
        if (!notif.getTenantId().equals(userDetails.getTenantId())) {
            throw new org.springframework.security.access.AccessDeniedException("Tenant mismatch");
        }
        if (notif.getTargetHouseholdId() != null && !notif.getTargetHouseholdId().equals(userDetails.getUid())) {
            throw new org.springframework.security.access.AccessDeniedException("Notification target mismatch");
        }
        notif.setRead(true);
        notificationRepository.save(notif);
    }

    public void markAllNotificationsAsRead(String tenantId) {
        List<Notification> notifs = notificationRepository.findByTenantId(tenantId);
        for (Notification n : notifs) {
            if (!n.isRead()) {
                n.setRead(true);
                notificationRepository.save(n);
            }
        }
    }
}
