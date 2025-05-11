package com.example.backend.infrastructure.schedule;

import com.example.backend.domain.dto.AiArticleRequest;
import com.example.backend.domain.dto.ArticleDto;
import com.example.backend.domain.service.article.ArticleApiService;
import com.example.backend.domain.service.article.ArticleService;
import com.example.backend.domain.utils.DateUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
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
public abstract class ArticleFetcher {
    private static final String SUCCESS = "Article sent successfully: {}";
    private static final String ERROR = "Failed to send article: {}";
    private static final String AI_URL = "http://ai:5000";
    private static final String ARTICLES_ENDPOINT = "/articles";

    private final WebClient webClient;
    private final ArticleService articleService;
    private final ArticleApiService articleApiService;

    protected void fetchArticles() {
        log.info("Fetching articles");
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime prevDay = now.minusDays(1);

        List<ArticleDto> articles = fetchAndFilterArticles(prevDay, now);
        log.info("Fetched articles: {}", articles.size());
        if (articles.isEmpty()) {
            return;
        }

        List<ArticleDto> savedArticles = saveArticles(articles);
        log.info("Saved articles: {}", savedArticles.size());
        if (savedArticles.isEmpty()) {
            return;
        }

        log.info("Sending articles to AI");
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
        for (ArticleDto article : savedArticles) {
            AiArticleRequest request = new AiArticleRequest(
                    article.getExternalId(), article.getTitle(), article.getDescription(), getAiArticleDate(article)
            );

            Disposable subscribe = webClient.mutate()
                    .baseUrl(AI_URL)
                    .build()
                    .post()
                    .uri(ARTICLES_ENDPOINT)
                    .bodyValue(request)
                    .retrieve()
                    .toBodilessEntity()
                    .doOnSuccess(response -> log.info("Successfully sent article: {}", request))
                    .doOnError(error -> log.error("Error sending article: ", error))
                    .subscribe();

            log.info("AI response for article {}: {}", request, subscribe);
        }
    }

    private LocalDateTime getAiArticleDate(ArticleDto article) {
        return DateUtils.toLocalDateTime(article.getPublishedAt());
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
