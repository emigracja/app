package com.example.backend.domain.dto.mapper;

import com.example.backend.domain.dto.article.ArticleDto;
import com.example.backend.domain.dto.article.SymbolWithImpact;
import com.example.backend.infrastructure.database.entity.ArticleEntity;
import com.example.backend.infrastructure.database.entity.ArticleStockImpactEntity;
import lombok.AccessLevel;
import lombok.NoArgsConstructor;

import java.util.Collections;
import java.util.List;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class ArticleMapper {

    public static ArticleEntity map(ArticleDto articleDto) {
        return ArticleEntity.builder()
                .id(articleDto.getExternalId())
                .title(articleDto.getTitle())
                .slug(articleDto.getSlug())
                .author(articleDto.getAuthor())
                .url(articleDto.getUrl())
                .backgroundImage(articleDto.getBackgroundImage())
                .description(articleDto.getDescription())
                .publishedAt(articleDto.getPublishedAt())
                .build();
    }

    public static ArticleDto map(ArticleEntity articleEntity) {

        List<ArticleStockImpactEntity> impacts = articleEntity.getArticleImpacts();

        return ArticleDto.builder()
                .externalId(articleEntity.getId())
                .title(articleEntity.getTitle())
                .author(articleEntity.getAuthor())
                .slug(articleEntity.getSlug())
                .backgroundImage(articleEntity.getBackgroundImage())
                .url(articleEntity.getUrl())
                .description(articleEntity.getDescription())
                .publishedAt(articleEntity.getPublishedAt())
                .stocks(impacts == null ? Collections.emptyList() :
                        impacts
                                .stream()
                                .filter(entity -> !entity.getImpact().equals("none"))
                                .map(entity ->
                                        SymbolWithImpact.builder()
                                                .symbol(entity.getStock().getSymbol())
                                                .impact(entity.getImpact())
                                                .build()

                                ).toList()
                )
                .build();
    }
}
