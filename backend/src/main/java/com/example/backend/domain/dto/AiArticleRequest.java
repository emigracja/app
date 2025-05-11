package com.example.backend.domain.dto;

import java.time.LocalDateTime;

public record AiArticleRequest(String id, String title, String description, LocalDateTime publishedAt) {
}
