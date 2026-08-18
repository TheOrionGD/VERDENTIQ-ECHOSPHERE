package com.verdantiq.gateway.region;

import com.verdantiq.gateway.dept.StudentRegistryRecord;
import com.verdantiq.gateway.student.DigitalTwinDorm;
import com.verdantiq.gateway.user.User;
import org.junit.jupiter.api.Test;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.lang.reflect.Method;
import java.lang.reflect.ParameterizedType;
import java.lang.reflect.Type;
import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.fail;

public class RegionPrivacyConstraintTest {

    private static final List<Class<?>> RESTRICTED_CLASSES = Arrays.asList(
            HouseholdRecord.class,
            User.class,
            DigitalTwinDorm.class,
            StudentRegistryRecord.class
    );

    @Test
    public void testNoRegionEndpointReturnsRawIdentifiableRecords() {
        Method[] methods = RegionController.class.getDeclaredMethods();

        for (Method method : methods) {
            if (isEndpointMethod(method)) {
                Type returnType = method.getGenericReturnType();
                checkTypeForRestrictedClasses(returnType, method.getName());
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

    private void checkTypeForRestrictedClasses(Type type, String methodName) {
        if (type instanceof ParameterizedType) {
            ParameterizedType parameterizedType = (ParameterizedType) type;
            
            // Check if it's ResponseEntity<T> or List<T>
            Class<?> rawType = (Class<?>) parameterizedType.getRawType();
            if (ResponseEntity.class.isAssignableFrom(rawType) || List.class.isAssignableFrom(rawType)) {
                Type[] typeArguments = parameterizedType.getActualTypeArguments();
                for (Type typeArg : typeArguments) {
                    checkTypeForRestrictedClasses(typeArg, methodName);
                }
            }
        } else if (type instanceof Class) {
            Class<?> clazz = (Class<?>) type;
            if (RESTRICTED_CLASSES.contains(clazz)) {
                fail("Privacy Constraint Violation in RegionController." + methodName + 
                     "(): Endpoint must NEVER return raw identifiable record: " + clazz.getSimpleName() + 
                     ". Use an Aggregate DTO instead.");
            }
        }
    }
}
