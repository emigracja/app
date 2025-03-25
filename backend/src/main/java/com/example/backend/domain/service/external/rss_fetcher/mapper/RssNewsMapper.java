package com.example.backend.domain.service.external.rss_fetcher.mapper;

import com.example.backend.domain.dto.ArticleDto;
import com.example.backend.domain.service.external.rss_fetcher.model.RssNewsObject;
import lombok.AccessLevel;
import lombok.NoArgsConstructor;

import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Date;
import java.util.Locale;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class RssNewsMapper {

    public static ArticleDto getArticleDto(RssNewsObject.Item item) {
        return ArticleDto.builder()
                .title(item.getTitle())
                .description(item.getParsedDescription())
                .url(item.getLink())
                .publishedAt(getPublishedAt(item))
                .build();
    }

    private static Date getPublishedAt(RssNewsObject.Item item) {
        String pubDate = item.getPubDate();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("EEE, dd MMM yyyy HH:mm:ss Z", Locale.ENGLISH);

        try {
            ZonedDateTime zonedDateTime = ZonedDateTime.parse(pubDate, formatter);
            return Date.from(zonedDateTime.toInstant());
        } catch (Exception e) {
            return null;
        }
    }
}
