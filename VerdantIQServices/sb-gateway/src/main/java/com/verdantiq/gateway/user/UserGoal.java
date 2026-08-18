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
@Document(collection = "user_goals")
public class UserGoal {
    @Id
    private String id;
    
    @Indexed
    private String householdId;
    
    private String title;
    private double target;
    private double currentProgress;
    private Instant deadline;
    private String status;
}
