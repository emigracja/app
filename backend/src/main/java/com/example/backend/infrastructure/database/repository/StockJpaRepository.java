package com.example.backend.infrastructure.database.repository;

import com.example.backend.infrastructure.database.entity.StockEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StockJpaRepository extends JpaRepository<StockEntity, String> {
    List<StockEntity> findBySymbol(String symbol);
}
