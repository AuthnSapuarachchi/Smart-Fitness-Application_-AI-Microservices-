package com.fitness.aiservice.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "activityservice")
public interface ActivityServiceClient {
    
    @GetMapping("/api/activities")
    String getActivities();
    
    @PostMapping("/api/recommendations")
    String generateRecommendation(@RequestBody String activityData);
}
