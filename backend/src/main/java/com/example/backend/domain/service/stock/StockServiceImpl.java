package com.example.backend.domain.service.stock;

import com.example.backend.domain.dto.StockDto;
import com.example.backend.domain.dto.mapper.StockMapper;
import com.example.backend.infrastructure.database.entity.StockEntity;
import com.example.backend.infrastructure.database.repository.StockJpaRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class StockServiceImpl implements StockService {
    private final StockApiService stockApiService;
    private final StockJpaRepository stockJpaRepository;

    @Override
    public List<StockDto> getAllStocks() {
        return stockJpaRepository.findAll().stream().map(StockMapper::map).toList();
    }

    @Override
    @Transactional
    public StockDto addStock(String symbol) {
        List<StockEntity> entities = stockJpaRepository.findBySymbol(symbol);

        if (entities.isEmpty()) {
            StockDto stock = stockApiService.getStockBySymbol(symbol);
            StockEntity saved = stockJpaRepository.save(StockMapper.map(stock));
            return StockMapper.map(saved);
        }
        return entities.stream().map(StockMapper::map).toList().getFirst();
    }

}
