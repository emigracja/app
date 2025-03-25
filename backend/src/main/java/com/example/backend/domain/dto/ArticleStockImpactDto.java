package com.example.backend.domain.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ArticleStockImpactDto {

    @NotBlank(message = "Article ID cannot be empty")
    private String article_id;

    @NotBlank(message = "Stock ID cannot be empty")
    private String stock_id;

    @NotBlank(message = "Impact level is required")
    @Pattern(regexp = "none|low|medium|high|severe", message = "Impact must be one of: none, low, medium, high, severe")
    private String impact;

    private String reason;
}


/*
* Frontend (User, Date-range, Impact) -> Backend
* Backend -> getUserStocks -> getImpactsByStocks -> filter by Impact -> getBoundedArticles -> filter by date-range
* Backend (List<Articles>) -> Frontend
* */