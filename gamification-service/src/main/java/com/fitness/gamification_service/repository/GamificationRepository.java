package com.fitness.gamification_service.repository;

import com.fitness.gamification_service.model.GamificationProfile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface GamificationRepository extends JpaRepository<GamificationProfile, Long> {
    Optional<GamificationProfile> findByUserId(String userId);
}
