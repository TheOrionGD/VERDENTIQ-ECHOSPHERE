package com.verdantiq.gateway.auth;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserDto {
    private String uid;
    private String email;
    private String name;
    private String role;
    private String tenantId;
    private String departmentId;
}
