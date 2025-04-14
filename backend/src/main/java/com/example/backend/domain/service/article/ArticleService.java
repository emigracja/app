package com.example.backend.domain.service.article;

import com.example.backend.api.params.ArticleSearchParams;
import com.example.backend.domain.dto.ArticleDto;
import org.springframework.util.MultiValueMap;

import java.util.List;
import java.util.Optional;

public interface ArticleService {

    List<ArticleDto> findAllBySearchParams(ArticleSearchParams params);

    ArticleDto addArticle(ArticleDto articleDto);

    List<ArticleDto> saveAll(List<ArticleDto> articles);

    Optional<ArticleDto> findById(String id);
}
