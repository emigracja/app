package com.example.backend.domain.dto.mapper;

import com.example.backend.domain.dto.ArticleStockImpactDto;
import com.example.backend.infrastructure.database.entity.ArticleEntity;
import com.example.backend.infrastructure.database.entity.ArticleStockImpactEntity;
import com.example.backend.infrastructure.database.entity.StockEntity;
import lombok.AccessLevel;
import lombok.NoArgsConstructor;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class ArticleStockImpactMapper {

    public static ArticleStockImpactDto map(ArticleStockImpactEntity entity) {
        return ArticleStockImpactDto.builder()
                .articleId(entity.getArticle().getId())
                .stockId(entity.getStock().getId())
                .reason(entity.getReason())
                .impact(entity.getImpact())
                .build();
    }

    public static ArticleStockImpactEntity map(ArticleStockImpactDto dto) {
        return ArticleStockImpactEntity.builder()
                .article(ArticleEntity.builder()
                        .id(dto.getArticleId())
                        .build())
                .stock(StockEntity.builder()
                        .id(dto.getStockId())
                        .build())
                .reason(dto.getReason())
                .impact(dto.getImpact())
                .build();
    }
}
