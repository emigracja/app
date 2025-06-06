package com.example.backend.domain.service.external.rss_fetcher.fetcher.polsat;

import com.example.backend.domain.dto.article.ArticleDto;
import com.example.backend.domain.service.external.rss_fetcher.fetcher.Fetcher;
import com.example.backend.domain.service.external.rss_fetcher.fetcher.RssFetcher;
import com.example.backend.domain.service.external.rss_fetcher.mapper.PolsatNewsRssNewsMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class PolsatNewsRssFetcher extends RssFetcher<PolastNewsRssObject> implements Fetcher {

    private final PolsatNewsRssNewsMapper polsatNewsRssNewsMapper;

    private static final String RSS_URL = "https://www.polsatnews.pl/rss/wszystkie.xml";

    @Override
    public List<ArticleDto> fetch() {
        return fetchRss(RSS_URL, PolastNewsRssObject.class)
                .getChannel()
                .getItems()
                .stream()
                .map(polsatNewsRssNewsMapper::map)
                .toList();
    }
}
