package com.example.backend.domain.dto;

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
    private String id;
    private String title;
    private String author;
    private String backgroundImage;
    private String url;
    private String description;
    private Date publishedAt;
    private List<String> stocks;
}
