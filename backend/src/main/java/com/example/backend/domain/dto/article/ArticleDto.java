package com.example.backend.domain.dto.article;

import lombok.*;

import java.util.Date;
import java.util.List;

@Setter
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ArticleDto {
    private String slug;
    private String externalId;
    private String title;
    private String author;
    private String backgroundImage;
    private String url;
    private String description;
    private Date publishedAt;
    private List<SymbolWithImpact> stocks;
}
