package com.example.backend.infrastructure.schedule;

import com.example.backend.domain.service.article.ArticleApiService;
import com.example.backend.domain.service.article.ArticleService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Profile;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;

/**
 * Scheduler for development environment
 * Uses fixed rate scheduling for more frequent article fetching during development
 */
@Component
@Profile({"dev", "default"})
@Slf4j
public class DevArticleFetcher extends ArticleFetcher {

    private long fixedRate = 100000;

    public DevArticleFetcher(WebClient webClient, ArticleService articleService, ArticleApiService articleApiService) {
        super(webClient, articleService, articleApiService);
    }

    @Scheduled(fixedRateString = "100000")
    public void scheduleFetchArticles() {
        log.info("DEV environment: Running article fetch with fixed rate of {} ms", fixedRate);
        fetchArticles();
    }
}
