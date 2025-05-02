package com.example.backend.domain.service.article;

import com.example.backend.domain.dto.ArticleDto;
import com.example.backend.domain.service.external.rss_fetcher.service.RssNewsService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ArticleApiServiceImpl implements ArticleApiService {
    private final RssNewsService rssNewsService;

    @Override
    public List<ArticleDto> fetchNewArticles() {
        return rssNewsService.fetchNewArticles();
    }
}
