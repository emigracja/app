package com.example.backend.infrastructure.database.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.*;

import jakarta.persistence.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "ARTICLE_STOCK_IMPACTS")
public class ArticleStockImpactEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne
    @JoinColumn(name = "article_id", nullable = false)
    private ArticleEntity article;

    @ManyToOne
    @JoinColumn(name = "stock_id", nullable = false)
    private StockEntity stock;

    @Column(name = "impact", nullable = false)
    private String impact;

    @Column(name = "reason")
    private String reason;
}

