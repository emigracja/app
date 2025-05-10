package com.example.backend.domain.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ArticleStockImpactDto {

    @JsonIgnore
    private String articleId;

    @NotBlank(message = "Stock ID cannot be empty")
    @JsonProperty("stock_id")
    private String stockId;

    @NotBlank(message = "Impact level is required")
    @Pattern(regexp = "none|low|medium|high|severe", message = "Impact must be one of: none, low, medium, high, severe")
    private String impact;

    private String reason;
}