package com.example.backend.domain.service.impact;

import com.example.backend.domain.dto.ArticleStockImpactDto;
import com.example.backend.infrastructure.database.entity.ArticleStockImpactEntity;

public interface ArticleStockImpactService {
    ArticleStockImpactEntity processImpact(ArticleStockImpactDto request);
}
