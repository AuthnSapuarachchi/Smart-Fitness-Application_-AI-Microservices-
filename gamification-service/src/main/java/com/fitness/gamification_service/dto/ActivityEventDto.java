package com.fitness.gamification_service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ActivityEventDto {

    private String id;
    private String userId;
    private String type; // RUNNING, CYCLING, etc.
    private double duration;
    private double caloriesBurned;
    private LocalDateTime startTime;

}
