package com.example.backend.domain.service.external.rss_fetcher.mapper;

import com.example.backend.domain.dto.ArticleDto;
import com.example.backend.domain.service.article.slug.SlugGenerator;
import com.example.backend.domain.service.external.rss_fetcher.fetcher.polsat.PolastNewsRssObject;
import lombok.Data;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.Date;

@Component
public class PolsatNewsRssNewsMapper implements Mapper<PolastNewsRssObject.Item> {

    private static final String source = "polsatnews.pl";

    public ArticleDto map(PolastNewsRssObject.Item item) {
        if (item == null) {
            throw new IllegalArgumentException("item cannot be null");
        }

        String title = item.getTitle();
        String slug = title != null ? SlugGenerator.createSlugFromTitle(title) : null;
        String description = item.getParsedDescription();
        String url = item.getLink();
        String imageUrl = (item.getEnclosure() != null) ? item.getEnclosure().getUrl() : null;
        Date publishedAt = Common.parseRFC1123Date(item.getPubDate());

        return ArticleDto.builder()
                .title(title)
                .author(source)
                .slug(slug)
                .description(description)
                .url(url)
                .backgroundImage(imageUrl)
                .publishedAt(publishedAt)
                .build();
    }

}
