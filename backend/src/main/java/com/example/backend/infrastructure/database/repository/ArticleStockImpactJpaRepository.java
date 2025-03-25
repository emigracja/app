package com.example.backend.infrastructure.database.repository;

import com.example.backend.infrastructure.database.entity.ArticleStockImpactEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ArticleStockImpactJpaRepository extends JpaRepository<ArticleStockImpactEntity, String> {
}
