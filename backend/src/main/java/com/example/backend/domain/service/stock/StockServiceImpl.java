package com.example.backend.domain.service.stock;

import com.example.backend.domain.dto.StockDto;
import com.example.backend.domain.dto.mapper.StockMapper;
import com.example.backend.infrastructure.database.repository.StockJpaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class StockServiceImpl implements StockService {
    private final StockJpaRepository stockJpaRepository;

    @Override
    public List<StockDto> getAllStocks() {
        return stockJpaRepository.findAll().stream().map(StockMapper::map).toList();
    }

}
