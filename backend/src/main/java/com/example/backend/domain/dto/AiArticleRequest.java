package com.example.backend.domain.dto;

import java.time.LocalDateTime;

public record AiArticleRequest(String externalId, String title, String description, LocalDateTime publishedAt) {
}
