package com.example.backend.domain.service;

import com.example.backend.domain.dto.ArticleStockImpactDto;

public interface ArticleStockImpactService {
    void processImpact(ArticleStockImpactDto request);
}
