package com.verdantiq.gateway.auth;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Document(collection = "otps")
public class OtpEntity {
    @Id
    private String email;
    private String code;
    private Instant expiry;

    public OtpEntity() {}

    public OtpEntity(String email, String code, Instant expiry) {
        this.email = email;
        this.code = code;
        this.expiry = expiry;
    }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }
    public Instant getExpiry() { return expiry; }
    public void setExpiry(Instant expiry) { this.expiry = expiry; }
}
