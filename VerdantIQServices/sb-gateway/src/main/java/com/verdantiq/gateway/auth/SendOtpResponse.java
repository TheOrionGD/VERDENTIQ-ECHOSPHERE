package com.verdantiq.gateway.auth;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SendOtpResponse {
    private boolean success;
    private String message;
    private String otpSentAt;
}
