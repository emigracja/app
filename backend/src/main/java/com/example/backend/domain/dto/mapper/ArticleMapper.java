package com.example.backend.domain.dto.mapper;

import com.example.backend.domain.dto.ArticleDto;
import com.example.backend.infrastructure.database.entity.ArticleEntity;
import lombok.AccessLevel;
import lombok.NoArgsConstructor;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class ArticleMapper {

    public static ArticleEntity map(ArticleDto articleDto){
        return ArticleEntity.builder()
                .id(articleDto.getExternalId())
                .title(articleDto.getTitle())
                .url(articleDto.getUrl())
                .description(articleDto.getDescription())
                .publishedAt(articleDto.getPublishedAt())
                .build();
    }

    public static ArticleDto map(ArticleEntity articleEntity){
        return ArticleDto.builder()
                .externalId(articleEntity.getId())
                .title(articleEntity.getTitle())
                .url(articleEntity.getUrl())
                .description(articleEntity.getDescription())
                .publishedAt(articleEntity.getPublishedAt())
                .build();
    }
}
