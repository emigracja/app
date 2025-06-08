package com.example.backend.domain.service.impact;

import com.example.backend.domain.dto.ArticleStockImpactDto;
import com.example.backend.domain.dto.mapper.ArticleStockImpactMapper;
import com.example.backend.infrastructure.database.entity.ArticleStockImpactEntity;
import com.example.backend.infrastructure.database.repository.ArticleStockImpactJpaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ArticleStockImpactServiceImpl implements ArticleStockImpactService {
    private final ArticleStockImpactJpaRepository articleStockImpactJpaRepository;

    @Override
    public ArticleStockImpactEntity processImpact(ArticleStockImpactDto dto) {
        ArticleStockImpactEntity mapped = ArticleStockImpactMapper.map(dto);
        articleStockImpactJpaRepository.save(mapped);
        return mapped;
    }

    @Override
    public ArticleStockImpactEntity getAnyImpact() {
        return articleStockImpactJpaRepository.findAll()
                .stream()
                .findFirst()
                .orElse(null);
    }
}
