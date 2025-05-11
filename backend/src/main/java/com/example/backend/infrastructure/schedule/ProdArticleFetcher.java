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
 * Scheduler for production environment
 * Uses cron expression for scheduled article fetching on production
 */
@Component
@Profile("prod")
@Slf4j
public class ProdArticleFetcher extends ArticleFetcher {

    @Value("${article.scheduler.cron:0 0 8 * * *}")
    private String cronExpression;

    public ProdArticleFetcher(WebClient webClient, ArticleService articleService, ArticleApiService articleApiService) {
        super(webClient, articleService, articleApiService);
    }

    @Scheduled(cron = "${article.scheduler.cron:0 0 8 * * *}")
    public void scheduleFetchArticles() throws InterruptedException {
        log.info("PROD environment: Running article fetch with cron expression: {}", cronExpression);
        fetchArticles();
    }
}
