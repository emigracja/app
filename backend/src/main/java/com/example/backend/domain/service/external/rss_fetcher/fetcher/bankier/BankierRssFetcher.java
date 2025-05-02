package com.example.backend.domain.service.external.rss_fetcher.fetcher.bankier;

import com.example.backend.domain.dto.ArticleDto;
import com.example.backend.domain.service.external.rss_fetcher.fetcher.Fetcher;
import com.example.backend.domain.service.external.rss_fetcher.fetcher.RssFetcher;
import com.example.backend.domain.service.external.rss_fetcher.mapper.BankierRssNewsMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class BankierRssFetcher extends RssFetcher<BankierRssObject> implements Fetcher {

    private final BankierRssNewsMapper bankierRssNewsMapper;

    private static final String GENERAL_NEWS_URL = "https://www.bankier.pl/rss/wiadomosci.xml";
    private static final String COMPANIES_NEWS_URL = "https://www.bankier.pl/rss/firma.xml";
    private static final String CURRENCIES_NEWS_URL = "https://www.bankier.pl/rss/waluty.xml";
    private static final String STOCK_MARKET_NEWS_URL = "https://www.bankier.pl/rss/gielda.xml";

    private static final List<String> urls =
            List.of(GENERAL_NEWS_URL, COMPANIES_NEWS_URL, CURRENCIES_NEWS_URL, STOCK_MARKET_NEWS_URL);

    @Override
    public List<ArticleDto> fetch() {
       List<BankierRssObject> newsObjects = urls.stream().map(
                url -> fetchRss(url, BankierRssObject.class)
        ).toList();

        return newsObjects.stream()
                .flatMap(newsObject -> newsObject.getChannel().getItems().stream())
                .map(bankierRssNewsMapper::map)
                .toList();
    }
}
