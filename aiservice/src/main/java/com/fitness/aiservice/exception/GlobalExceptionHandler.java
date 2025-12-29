package com.fitness.aiservice.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(RecommendationNotFoundException.class)
    public ResponseEntity<String> handleNotFound(RecommendationNotFoundException ex) {
        // ✅ Returns 404 NOT_FOUND instead of 500 INTERNAL_SERVER_ERROR
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
    }
}
