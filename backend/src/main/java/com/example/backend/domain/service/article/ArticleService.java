package com.example.backend.domain.service.article;

import com.example.backend.domain.dto.ArticleDto;

import java.util.List;

public interface ArticleService {

    List<ArticleDto> findAllArticles();

    ArticleDto addArticle(ArticleDto articleDto);

    List<ArticleDto> saveAll(List<ArticleDto> articles);
}
