package com.example.backend.domain.service.external.rss_fetcher.mapper;

import com.example.backend.domain.dto.ArticleDto;

public interface Mapper<T> {
    ArticleDto map(T item);
}
