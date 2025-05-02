package com.example.backend.domain.service.external.rss_fetcher.mapper;

import com.example.backend.domain.dto.ArticleDto;
import com.example.backend.domain.service.article.slug.SlugGenerator;
import com.example.backend.domain.service.external.rss_fetcher.fetcher.bankier.BankierRssObject;
import org.springframework.stereotype.Component;

import static com.example.backend.domain.service.external.rss_fetcher.mapper.Common.parseRFC1123Date;

@Component
public class BankierRssNewsMapper implements Mapper<BankierRssObject.Item> {

    private static final String source = "bankier.pl";

    public ArticleDto map(BankierRssObject.Item item) {
        return ArticleDto.builder()
                .title(item.getTitle())
                .author(source)
                .slug(SlugGenerator.createSlugFromTitle(item.getTitle()))
                .description(item.getParsedDescription())
                .backgroundImage(item.getBackgroundImage())
                .url(item.getLink())
                .publishedAt(parseRFC1123Date(item.getPubDate()))
                .build();
    }
}
