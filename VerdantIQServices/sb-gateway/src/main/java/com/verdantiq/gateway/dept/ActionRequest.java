package com.verdantiq.gateway.dept;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ActionRequest {
    private String action;
    private String reason;
    private String notes;
}
