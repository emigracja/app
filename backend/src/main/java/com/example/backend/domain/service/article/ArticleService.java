package com.example.backend.domain.service.article;

import com.example.backend.api.params.ArticleSearchParams;
import com.example.backend.domain.dto.article.ArticleDto;

import java.util.List;
import java.util.Optional;

public interface ArticleService {

    List<ArticleDto> findAllBySearchParams(ArticleSearchParams params);

    ArticleDto addArticle(ArticleDto articleDto);

    List<ArticleDto> saveAll(List<ArticleDto> articles);

    Optional<ArticleDto> findById(String id);

    List<ArticleDto> getArticlesForUser(ArticleSearchParams params, String email);

    Optional<ArticleDto> findBySlug(String slug);
}
