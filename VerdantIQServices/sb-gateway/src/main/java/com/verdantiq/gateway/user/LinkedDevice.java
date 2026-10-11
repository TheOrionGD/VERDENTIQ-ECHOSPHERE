package com.verdantiq.gateway.user;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "linkeddevices")
public class LinkedDevice {
    @Id
    private String id;
    private String householdId;
    private String deviceType;
    private String manufacturer;
    private String status;
    private Double averageDailyKwh;
}
