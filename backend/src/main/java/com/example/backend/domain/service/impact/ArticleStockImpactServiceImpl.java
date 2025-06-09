package com.example.backend.domain.service.impact;

import com.example.backend.domain.dto.ArticleStockImpactDto;
import com.example.backend.domain.dto.mapper.ArticleStockImpactMapper;
import com.example.backend.infrastructure.database.entity.ArticleEntity;
import com.example.backend.infrastructure.database.entity.ArticleStockImpactEntity;
import com.example.backend.infrastructure.database.entity.StockEntity;
import com.example.backend.infrastructure.database.repository.ArticleJpaRepository;
import com.example.backend.infrastructure.database.repository.ArticleStockImpactJpaRepository;
import com.example.backend.infrastructure.database.repository.StockJpaRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ArticleStockImpactServiceImpl implements ArticleStockImpactService {
    private final ArticleStockImpactJpaRepository articleStockImpactJpaRepository;
    private final ArticleJpaRepository articleRepository;
    private final StockJpaRepository stockRepository;

    @Override
    @Transactional
    public ArticleStockImpactEntity processImpact(ArticleStockImpactDto dto) {
        ArticleEntity article = articleRepository.findById(dto.getArticleId()).orElseThrow(
                () -> new EntityNotFoundException("Article not found with id: " + dto.getArticleId())
        );

        StockEntity stock = stockRepository.findById(dto.getStockId()).orElseThrow(
                () -> new EntityNotFoundException("Stock not found with id: " + dto.getStockId())
        );

        ArticleStockImpactEntity impactEntity = new ArticleStockImpactEntity();
        impactEntity.setArticle(article);
        impactEntity.setStock(stock);
        impactEntity.setImpact(dto.getImpact());
        impactEntity.setReason(dto.getReason());

        return articleStockImpactJpaRepository.save(impactEntity);
    }
    @Override
    public ArticleStockImpactEntity getAnyImpact() {
        return articleStockImpactJpaRepository.findAll()
                .stream()
                .findFirst()
                .orElse(null);
    }
}
