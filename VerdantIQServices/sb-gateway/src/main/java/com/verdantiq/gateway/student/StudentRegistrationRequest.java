package com.verdantiq.gateway.student;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StudentRegistrationRequest {
    private String name;
    private String email;
    private String studentIdNumber;
    private String departmentId;
    private String institutionId;
}
