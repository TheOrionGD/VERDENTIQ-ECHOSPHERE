package com.verdantiq.gateway.user;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "reward_items")
public class RewardItem {
    @Id
    private String id;
    
    @Indexed
    private String householdId;
    
    private String title;
    private String description;
    private int pointsCost;
    private Instant redeemedAt;
}
