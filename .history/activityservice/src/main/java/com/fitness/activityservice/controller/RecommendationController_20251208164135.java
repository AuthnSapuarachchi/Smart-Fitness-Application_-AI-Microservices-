package com.fitness.activityservice.controller;

import com.fitness.activityservice.service.ActivityAiService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/recommendations")
@RequiredArgsConstructor
public class RecommendationController {

    private final ActivityAiService activityAiService;

    @PostMapping
    public ResponseEntity<String> generateRecommendation(@RequestBody String activityData) {
        String recommendation = activityAiService.generateRecommendation(null);
        return ResponseEntity.ok(recommendation);
    }
}
