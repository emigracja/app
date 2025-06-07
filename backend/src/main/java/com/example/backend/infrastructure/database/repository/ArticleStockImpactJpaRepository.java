package com.example.backend.infrastructure.database.repository;

import com.example.backend.infrastructure.database.entity.ArticleStockImpactEntity;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ArticleStockImpactJpaRepository extends JpaRepository<ArticleStockImpactEntity, String> {
    @Query("SELECT a FROM ArticleStockImpactEntity a WHERE a.stock.symbol = :symbol AND a.impact <> 'none'")
    List<ArticleStockImpactEntity> findAllByStockSymbol(@Param("symbol") String symbol, Pageable pageable);
}