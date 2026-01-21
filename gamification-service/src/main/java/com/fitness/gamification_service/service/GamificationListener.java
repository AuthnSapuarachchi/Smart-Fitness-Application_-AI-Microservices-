package com.fitness.gamification_service.service;

import com.fitness.gamification_service.dto.ActivityEventDto;
import com.fitness.gamification_service.model.GamificationProfile;
import com.fitness.gamification_service.repository.GamificationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@Slf4j
@RequiredArgsConstructor
public class GamificationListener {

    private final GamificationRepository gamificationRepository;

    @RabbitListener(queues = "gamification.activity.queue")
    public void handleActivityEvent(ActivityEventDto event) {
        log.info("🎮 Gamification received activity for User: {}", event.getUserId());

        // 1. Find the user's profile, or create a new one if it doesn't exist
        GamificationProfile profile = gamificationRepository.findByUserId(event.getUserId())
                .orElse(GamificationProfile.builder()
                        .userId(event.getUserId())
                        .totalPoints(0)
                        .currentStreak(0)
                        .build());

        // 2. Calculate Points (Simple Rule: 10 points per workout)
        int pointsEarned = 10;

        // 3. Update the Profile
        profile.setTotalPoints(profile.getTotalPoints() + pointsEarned);

        // (We will add advanced Streak logic in the next step!)

        // 4. Save
        gamificationRepository.save(profile);
        log.info("✅ Points updated! New Total: {}", profile.getTotalPoints());
    }

}
