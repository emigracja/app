package com.example.backend.domain.service.external.rss_fetcher.service;

import com.example.backend.domain.dto.ArticleDto;
import com.example.backend.domain.service.external.rss_fetcher.RssFetcher;
import com.example.backend.domain.service.external.rss_fetcher.mapper.RssNewsMapper;
import com.example.backend.domain.service.external.rss_fetcher.model.RssNewsObject;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class RssNewsService extends RssFetcher<RssNewsObject> {
    public static final String BANKIER_GENERAL_NEWS_URL = "https://www.bankier.pl/rss/wiadomosci.xml";
    public static final String BANKIER_COMPANIES_NEWS_URL = "https://www.bankier.pl/rss/firma.xml";
    public static final String BANKIER_CURRENCIES_NEWS_URL = "https://www.bankier.pl/rss/waluty.xml";
    public static final String BANKIER_STOCK_MARKET_NEWS_URL = "https://www.bankier.pl/rss/gielda.xml";
    public static final String POLSAT_NEWS_GENERAL_NEWS_URL = "https://www.polsatnews.pl/rss/wszystkie.xml";

    public List<ArticleDto> fetchGeneralNews() {
        return fetchArticles(BANKIER_GENERAL_NEWS_URL);
    }

    public List<ArticleDto> fetchStockMarketNews() {
        return fetchArticles(BANKIER_STOCK_MARKET_NEWS_URL);
    }

    public List<ArticleDto> fetchCurrenciesNews() {
        return fetchArticles(BANKIER_CURRENCIES_NEWS_URL);
    }

    public List<ArticleDto> fetchCompaniesNews() {
        return fetchArticles(BANKIER_COMPANIES_NEWS_URL);
    }

    public List<ArticleDto> fetchPolsatNewsAllNews() {
        return fetchArticles(POLSAT_NEWS_GENERAL_NEWS_URL);
    }

    private List<ArticleDto> fetchArticles(String url) {
        RssNewsObject rssNewsObject = fetchRss(url, RssNewsObject.class);
        if (rssNewsObject == null) return List.of();

        List<ArticleDto> articles = new ArrayList<>();
        for (RssNewsObject.Item item : rssNewsObject.getChannel().getItems()) {
            ArticleDto articleDto = RssNewsMapper.getArticleDto(item);
            articleDto.setAuthor(rssNewsObject.getChannel().getTitle());
            articles.add(articleDto);
        }
        return articles;
    }
}

