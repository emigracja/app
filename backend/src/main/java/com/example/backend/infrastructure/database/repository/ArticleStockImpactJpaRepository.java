package com.example.backend.infrastructure.database.repository;

import com.example.backend.infrastructure.database.entity.ArticleStockImpactEntity;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ArticleStockImpactJpaRepository extends JpaRepository<ArticleStockImpactEntity, String> {
    List<ArticleStockImpactEntity> findAllByStockSymbol(String symbol, Pageable pageable);
}
