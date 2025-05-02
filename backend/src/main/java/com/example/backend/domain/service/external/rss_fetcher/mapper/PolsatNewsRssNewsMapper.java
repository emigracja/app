package com.example.backend.domain.service.external.rss_fetcher.mapper;

import com.example.backend.domain.dto.ArticleDto;
import com.example.backend.domain.service.article.slug.SlugGenerator;
import com.example.backend.domain.service.external.rss_fetcher.fetcher.polsat.PolastNewsRssObject;
import org.springframework.stereotype.Component;

@Component
public class PolsatNewsRssNewsMapper implements Mapper<PolastNewsRssObject.Item> {

    private static final String source = "polsatnews.pl";

    public ArticleDto map(PolastNewsRssObject.Item item) {
        return ArticleDto.builder()
                .title(item.getTitle())
                .author(source)
                .slug(SlugGenerator.createSlugFromTitle(item.getTitle()))
                .description(item.getParsedDescription())
                .url(item.getLink())
                .backgroundImage(item.getEnclosure().getUrl())
                .publishedAt(Common.parseRFC1123Date(item.getPubDate()))
                .build();
    }
}
