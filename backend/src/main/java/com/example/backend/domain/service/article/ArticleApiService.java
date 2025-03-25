package com.example.backend.domain.service.article;

import com.example.backend.domain.dto.ArticleDto;

import java.util.List;

public interface ArticleApiService {
    List<ArticleDto> fetchNewArticles();
}
