package com.example.backend.domain.service.external.rss_fetcher.service;

import com.example.backend.domain.dto.article.ArticleDto;
import com.example.backend.domain.service.external.rss_fetcher.fetcher.Fetcher;
import com.example.backend.domain.service.external.rss_fetcher.fetcher.RssFetcher;
import com.example.backend.domain.service.external.rss_fetcher.fetcher.bankier.BankierRssObject;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RssNewsService extends RssFetcher<BankierRssObject> {
    private final List<Fetcher> fetchers;

    public List<ArticleDto> fetchNewArticles() {
        List<ArticleDto> articles = new ArrayList<>();
        for (Fetcher fetcher : fetchers) {
            articles.addAll(fetcher.fetch());
        }
        return articles;
    }
}

