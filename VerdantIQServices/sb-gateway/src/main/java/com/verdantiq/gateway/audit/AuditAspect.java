package com.verdantiq.gateway.audit;

import com.verdantiq.gateway.common.security.CustomUserDetails;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.reflect.MethodSignature;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.lang.reflect.Method;
import java.util.Arrays;

@Aspect
@Component
public class AuditAspect {

    private static final Logger logger = LoggerFactory.getLogger(AuditAspect.class);

    @Autowired
    private AuditLogRepository auditLogRepository;

    @AfterReturning(value = "@annotation(AuditableWrite)", returning = "result")
    public void logAuditActivity(JoinPoint joinPoint, Object result) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication == null || !(authentication.getPrincipal() instanceof CustomUserDetails)) {
                logger.warn("No authenticated user found for audit logging.");
                return;
            }

            CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();

            MethodSignature signature = (MethodSignature) joinPoint.getSignature();
            Method method = signature.getMethod();
            AuditableWrite auditableWrite = method.getAnnotation(AuditableWrite.class);

            String action = auditableWrite.action();
            String resourceType = auditableWrite.resourceType();
            
            // Basic extraction of resourceId if possible, typically from return object or arguments
            // For now, we serialize the arguments or just log the method name
            String details = "Method: " + method.getName() + ", Args: " + Arrays.toString(joinPoint.getArgs());
            String resourceId = extractResourceId(result);

            AuditLog logEntry = new AuditLog(
                    userDetails.getUid(),
                    userDetails.getUsername(),
                    userDetails.getRole(),
                    userDetails.getTenantId(),
                    action,
                    resourceType,
                    resourceId,
                    details
            );

            auditLogRepository.save(logEntry);
            logger.info("Audit log saved: {} on {} by {}", action, resourceType, userDetails.getUsername());

        } catch (Exception e) {
            logger.error("Failed to save audit log", e);
        }
    }

    private String extractResourceId(Object result) {
        if (result == null) return "N/A";
        try {
            Method getIdMethod = result.getClass().getMethod("getId");
            Object id = getIdMethod.invoke(result);
            return id != null ? id.toString() : "N/A";
        } catch (Exception e) {
            return "Unknown (check details)";
        }
    }
}
