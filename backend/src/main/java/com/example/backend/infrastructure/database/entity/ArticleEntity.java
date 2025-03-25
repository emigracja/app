package com.example.backend.infrastructure.database.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.Date;
import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "ARTICLES")
public class ArticleEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(name = "title", unique = true, nullable = false)
    private String title;

    @Column(name = "description", columnDefinition = "TEXT", nullable = false)
    private String description;

    @Column(name = "published_at", nullable = false)
    private Date publishedAt;

    @Column(name = "author")
    private String author;

    @Column(name = "article_source")
    private String articleSource;

    @Column(name = "url")
    private String url;

    @OneToMany(mappedBy = "article")
    private List<ArticleStockImpactEntity> articleImpacts;
}
