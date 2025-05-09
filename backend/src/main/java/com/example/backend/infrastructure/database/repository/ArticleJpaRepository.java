package com.example.backend.infrastructure.database.repository;

import com.example.backend.infrastructure.database.entity.ArticleEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ArticleJpaRepository extends JpaRepository<ArticleEntity, String> {

    List<ArticleEntity> findAll(Specification<ArticleEntity> spec, Pageable pageable);

    List<ArticleEntity> findBySlugIsIn(List<String> slugs);
    /**
     * Version with pagination and sorting.
     * Finds unique articles related to stocks observed by a specific user.
     * Improved version: starts from UserEntity.
     *
     * @param userId   User ID.
     * @param pageable Pageable object for pagination and sorting.
     * @return Page of unique ArticleEntity.
     */
    @Query(value = "SELECT DISTINCT a FROM UserEntity u " +
            "JOIN u.stocks s " +
            "JOIN s.stockImpacts asi " +
            "JOIN asi.article a " +
            "WHERE u.id = :userId",
            countQuery = "SELECT COUNT(DISTINCT a) FROM UserEntity u " +
                    "JOIN u.stocks s " +
                    "JOIN s.stockImpacts asi " +
                    "JOIN asi.article a " +
                    "WHERE u.id = :userId")
    Page<ArticleEntity> findArticlesByUserId(@Param("userId") String userId, Pageable pageable);

    Optional<ArticleEntity> findBySlug(String slug);
}
