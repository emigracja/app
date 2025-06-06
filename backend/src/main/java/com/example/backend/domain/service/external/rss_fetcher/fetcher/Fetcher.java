package com.example.backend.domain.service.external.rss_fetcher.fetcher;

import com.example.backend.domain.dto.article.ArticleDto;

import java.util.List;

public interface Fetcher {
    List<ArticleDto> fetch();
}
