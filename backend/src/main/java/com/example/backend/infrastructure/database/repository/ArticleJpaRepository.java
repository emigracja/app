package com.example.backend.infrastructure.database.repository;

import com.example.backend.infrastructure.database.entity.ArticleEntity;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ArticleJpaRepository extends JpaRepository<ArticleEntity, String> {
    List<ArticleEntity> findAll(Specification<ArticleEntity> spec, Pageable pageable);
}
