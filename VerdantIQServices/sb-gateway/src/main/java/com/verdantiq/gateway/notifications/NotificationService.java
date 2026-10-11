package com.verdantiq.gateway.notifications;

import com.verdantiq.gateway.common.Notification;
import com.verdantiq.gateway.common.NotificationRepository;
import com.verdantiq.gateway.common.security.CustomUserDetails;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.stream.Collectors;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    // A simple in-memory list of active emitters for SSE
    private final List<SseEmitter> emitters = new CopyOnWriteArrayList<>();

    private String getCurrentTenantId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof CustomUserDetails) {
            return ((CustomUserDetails) authentication.getPrincipal()).getTenantId();
        }
        return "default";
    }

    public List<Notification> getNotifications() {
        String tenantId = getCurrentTenantId();
        // Here we could filter by user or household ID if the Notification object supported it fully,
        // but it currently targets tenantId, targetRole, targetDeptId, targetHouseholdId.
        // For full implementation, we fetch by tenant and could filter further if needed.
        return notificationRepository.findByTenantId(tenantId);
    }

    public Notification addNotification(Notification notification) {
        if (notification.getTenantId() == null) {
            notification.setTenantId(getCurrentTenantId());
        }
        notification.setRead(false);
        Notification saved = notificationRepository.save(notification);
        
        // Broadcast to SSE
        for (SseEmitter emitter : emitters) {
            try {
                emitter.send(SseEmitter.event().name("notification").data(saved));
            } catch (IOException e) {
                emitters.remove(emitter);
            }
        }
        
        return saved;
    }

    public Notification markAsRead(String id) {
        return notificationRepository.findById(id).map(notif -> {
            notif.setRead(true);
            return notificationRepository.save(notif);
        }).orElseThrow(() -> new RuntimeException("Notification not found"));
    }

    public void markAllAsRead() {
        String tenantId = getCurrentTenantId();
        List<Notification> unread = notificationRepository.findByTenantId(tenantId).stream()
                .filter(n -> !n.isRead())
                .collect(Collectors.toList());
        
        unread.forEach(n -> n.setRead(true));
        notificationRepository.saveAll(unread);
    }

    public SseEmitter subscribeToNotifications() {
        SseEmitter emitter = new SseEmitter(Long.MAX_VALUE);
        emitters.add(emitter);

        emitter.onCompletion(() -> emitters.remove(emitter));
        emitter.onTimeout(() -> emitters.remove(emitter));
        emitter.onError((e) -> emitters.remove(emitter));

        return emitter;
    }
}
