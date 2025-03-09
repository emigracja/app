package com.example.backend.infrastructure.database.entity;

import jakarta.persistence.*;
import lombok.*;


@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "STOCKS")
public class StockEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(unique = true, nullable = false)
    private String symbol;

    @Column(nullable = false)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private String ekd;

    @Column()
    private String address;

    @Column(nullable = false)
    private String country;

    @Column(nullable = false)
    private String exchange;
}
