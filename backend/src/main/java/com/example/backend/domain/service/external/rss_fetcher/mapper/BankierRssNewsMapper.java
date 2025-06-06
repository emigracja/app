package com.example.backend.domain.service.external.rss_fetcher.mapper;

import com.example.backend.domain.dto.article.ArticleDto;
import com.example.backend.domain.service.article.slug.SlugGenerator;
import com.example.backend.domain.service.external.rss_fetcher.fetcher.bankier.BankierRssObject;
import org.springframework.stereotype.Component;

import java.util.Date;

import static com.example.backend.domain.service.external.rss_fetcher.mapper.Common.parseRFC1123Date;

@Component
public class BankierRssNewsMapper implements Mapper<BankierRssObject.Item> {

    private static final String source = "bankier.pl";

    public ArticleDto map(BankierRssObject.Item item) {
        if (item == null) {
            throw new IllegalArgumentException("item cannot be null");
        }

        String title = item.getTitle();
        String slug = title != null ? SlugGenerator.createSlugFromTitle(title) : null;
        String description = item.getParsedDescription();
        String imageUrl = item.getBackgroundImage();
        String url = item.getLink();
        Date publishedAt = parseRFC1123Date(item.getPubDate());

        return ArticleDto.builder()
                .title(title)
                .author(source)
                .slug(slug)
                .description(description)
                .backgroundImage(imageUrl)
                .url(url)
                .publishedAt(publishedAt)
                .build();
    }

}
