package com.example.backend.domain.service.external.rss_fetcher.mapper;

import com.example.backend.domain.dto.article.ArticleDto;

public interface Mapper<T> {
    ArticleDto map(T item);
}
