package com.verdantiq.gateway.common;

import com.verdantiq.gateway.common.security.CustomUserDetails;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArrayList;

@Service
public class SseConnectionManager {

    private static final Logger logger = LoggerFactory.getLogger(SseConnectionManager.class);

    public static class SseClientConnection {
        private final SseEmitter emitter;
        private final CustomUserDetails userDetails;

        public SseClientConnection(SseEmitter emitter, CustomUserDetails userDetails) {
            this.emitter = emitter;
            this.userDetails = userDetails;
        }

        public SseEmitter getEmitter() { return emitter; }
        public CustomUserDetails getUserDetails() { return userDetails; }
    }

    // Maps tenantId to a list of client connections
    private final Map<String, List<SseClientConnection>> tenantConnections = new ConcurrentHashMap<>();

    public SseEmitter createConnection(CustomUserDetails userDetails) {
        SseEmitter emitter = new SseEmitter(0L); // No timeout for persistent connection
        String tenantId = userDetails.getTenantId();
        
        // Use a generic placeholder tenant if tenantId is missing (e.g. platform admin)
        String mapKey = tenantId != null ? tenantId : "GLOBAL";
        
        SseClientConnection connection = new SseClientConnection(emitter, userDetails);
        tenantConnections.computeIfAbsent(mapKey, k -> new CopyOnWriteArrayList<>()).add(connection);

        emitter.onCompletion(() -> removeConnection(mapKey, connection));
        emitter.onTimeout(() -> removeConnection(mapKey, connection));
        emitter.onError((e) -> removeConnection(mapKey, connection));

        return emitter;
    }

    private void removeConnection(String tenantId, SseClientConnection connection) {
        List<SseClientConnection> connections = tenantConnections.get(tenantId);
        if (connections != null) {
            connections.remove(connection);
            if (connections.isEmpty()) {
                tenantConnections.remove(tenantId);
            }
        }
    }

    public void dispatchEvent(String tenantId, Object eventPayload) {
        String mapKey = tenantId != null ? tenantId : "GLOBAL";
        List<SseClientConnection> connections = tenantConnections.get(mapKey);
        
        if (connections != null) {
            for (SseClientConnection connection : connections) {
                try {
                    boolean send = true;
                    if (eventPayload instanceof Notification notif) {
                        CustomUserDetails user = connection.getUserDetails();
                        
                        if (notif.getTargetHouseholdId() != null && !notif.getTargetHouseholdId().equals(user.getUid())) {
                            send = false;
                        } else if (notif.getTargetDeptId() != null && !notif.getTargetDeptId().equals(user.getDeptId())) {
                            send = false;
                        } else if (notif.getTargetRole() != null && !notif.getTargetRole().equals(user.getRole())) {
                            send = false;
                        }
                    }

                    if (send) {
                        connection.getEmitter().send(SseEmitter.event()
                                .id(String.valueOf(System.currentTimeMillis()))
                                .data(eventPayload));
                    }
                } catch (IOException e) {
                    logger.debug("Dead emitter detected, removing from tenant {}", mapKey);
                    connection.getEmitter().complete();
                    removeConnection(mapKey, connection);
                }
            }
        }
    }
}
