package com.example.backend.domain.service.article;

import com.example.backend.domain.dto.article.ArticleDto;

import java.util.List;

public interface ArticleApiService {
    List<ArticleDto> fetchNewArticles();
}
