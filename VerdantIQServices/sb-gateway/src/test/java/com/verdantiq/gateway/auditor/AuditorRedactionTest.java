package com.verdantiq.gateway.auditor;

import com.verdantiq.gateway.audit.AuditLog;
import org.junit.jupiter.api.Test;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.lang.reflect.Method;
import java.lang.reflect.ParameterizedType;
import java.lang.reflect.Type;
import java.util.List;

import static org.junit.jupiter.api.Assertions.fail;

public class AuditorRedactionTest {

    @Test
    public void testNoAuditEndpointReturnsRawAuditLog() {
        Method[] methods = AuditorController.class.getDeclaredMethods();

        for (Method method : methods) {
            if (isEndpointMethod(method)) {
                Type returnType = method.getGenericReturnType();
                checkTypeForRawAuditLog(returnType, method.getName());
            }
        }
    }

    private boolean isEndpointMethod(Method method) {
        return method.isAnnotationPresent(GetMapping.class) ||
               method.isAnnotationPresent(PostMapping.class) ||
               method.isAnnotationPresent(PutMapping.class) ||
               method.isAnnotationPresent(PatchMapping.class) ||
               method.isAnnotationPresent(DeleteMapping.class) ||
               method.isAnnotationPresent(RequestMapping.class);
    }

    private void checkTypeForRawAuditLog(Type type, String methodName) {
        if (type instanceof ParameterizedType) {
            ParameterizedType parameterizedType = (ParameterizedType) type;
            
            Class<?> rawType = (Class<?>) parameterizedType.getRawType();
            if (ResponseEntity.class.isAssignableFrom(rawType) || List.class.isAssignableFrom(rawType)) {
                Type[] typeArguments = parameterizedType.getActualTypeArguments();
                for (Type typeArg : typeArguments) {
                    checkTypeForRawAuditLog(typeArg, methodName);
                }
            }
        } else if (type instanceof Class) {
            Class<?> clazz = (Class<?>) type;
            if (AuditLog.class.equals(clazz)) {
                fail("Privacy Constraint Violation in AuditorController." + methodName + 
                     "(): Endpoint must NEVER return raw AuditLog. Use RedactedAuditLog instead.");
            }
        }
    }
}
