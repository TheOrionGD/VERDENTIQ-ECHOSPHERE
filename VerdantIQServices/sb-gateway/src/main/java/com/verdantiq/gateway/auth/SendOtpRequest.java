package com.verdantiq.gateway.auth;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SendOtpRequest {
    private String email;
    private String name;
    private String purpose;
}
