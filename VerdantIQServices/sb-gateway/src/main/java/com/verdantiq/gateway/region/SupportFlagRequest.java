package com.verdantiq.gateway.region;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SupportFlagRequest {
    private boolean supportFlagged;
    private String recommendation;
}
