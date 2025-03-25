package com.example.backend.domain.dto;

import lombok.*;

import java.util.Date;

@Setter
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ArticleDto {
    private String externalId;
    private String title;
    private String url;
    private String description;
    private Date publishedAt;
}
