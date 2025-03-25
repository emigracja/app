package com.example.backend.domain.service.article;

import com.example.backend.domain.dto.ArticleDto;
import com.example.backend.domain.service.external.rss_fetcher.service.RssNewsService;
import lombok.AccessLevel;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ArticleApiServiceImpl implements ArticleApiService {
    private final RssNewsService rssNewsService;

    @Override
    public List<ArticleDto> fetchNewArticles() {
        return ArticleListBuilder.builder()
                .addArticles(rssNewsService.fetchGeneralNews())
                .addArticles(rssNewsService.fetchCompaniesNews())
                .addArticles(rssNewsService.fetchStockMarketNews())
                .addArticles(rssNewsService.fetchCurrenciesNews())
                .addArticles(rssNewsService.fetchPolsatNewsAllNews())
                .build();
    }

    @NoArgsConstructor(access = AccessLevel.PRIVATE)
    private static class ArticleListBuilder {
        private final List<ArticleDto> articleList = new ArrayList<>();

        public static ArticleListBuilder builder() {
            return new ArticleListBuilder();
        }

        public ArticleListBuilder addArticles(List<ArticleDto> articles) {
            if (articles != null) {
                articleList.addAll(articles);
            }
            return this;
        }

        public List<ArticleDto> build() {
            return new ArrayList<>(articleList);
        }
    }
}
