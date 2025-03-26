package com.example.backend.infrastructure.schedule;

import com.example.backend.domain.dto.ArticleDto;
import com.example.backend.domain.service.article.ArticleApiService;
import com.example.backend.domain.service.article.ArticleService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.Disposable;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;
import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class ArticleFetcher {
    private static final String SUCCESS = "Article sent successfully: {}";
    private static final String ERROR = "Failed to send article: {}";
    private static final String AI_URL = "http://ai:5000";
    private static final String ARTICLES_ENDPOINT = "/articles";

    private final WebClient webClient;
    private final ArticleService articleService;
    private final ArticleApiService articleApiService;

    //    @Scheduled(fixedRate = 1000000)
    @Scheduled(cron = "0 0 8 * * *")
    public void fetchArticles() {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime prevDay = now.minusDays(1);

        List<ArticleDto> articles = fetchAndFilterArticles(prevDay, now);

        if (articles.isEmpty()) {
            return;
        }

        List<ArticleDto> savedArticles = saveArticles(articles);

        if (savedArticles.isEmpty()) {
            return;
        }

        sendArticlesToAI(savedArticles);
    }

    private List<ArticleDto> fetchAndFilterArticles(LocalDateTime prevDay, LocalDateTime now) {
        return articleApiService.fetchNewArticles().stream()
                .filter(article -> filterDates(article, prevDay, now))
                .toList();
    }

    private List<ArticleDto> saveArticles(List<ArticleDto> articles) {
        return articleService.saveAll(articles);
    }

    private void sendArticlesToAI(List<ArticleDto> savedArticles) {
        Disposable subscribe = webClient.mutate()
                .baseUrl(AI_URL)
                .build()
                .post()
                .uri(ARTICLES_ENDPOINT)
                .bodyValue(savedArticles)
                .retrieve()
                .toBodilessEntity()
                .doOnSuccess(response -> log.info("Successfully sent articles: {}", savedArticles))
                .doOnError(error -> log.error("Error sending articles: ", error))
                .subscribe();

        log.info("Subscription: {}", subscribe.toString());
    }

    private static boolean filterDates(ArticleDto article, LocalDateTime prevDay, LocalDateTime now) {
        Date published = article.getPublishedAt();

        if (published == null) {
            return false;
        }

        LocalDateTime publishedAt = published.toInstant()
                .atZone(ZoneId.systemDefault())
                .toLocalDateTime();

        return publishedAt.isAfter(prevDay) && publishedAt.isBefore(now);
    }
}
