package com.example.backend.domain.dto;

import java.time.LocalDateTime;
import java.util.Date;

public record AiArticleRequest(String external_id, String title, String description, Date published_at) {}
