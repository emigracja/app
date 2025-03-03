package com.example.backend.domain.service;

import com.example.backend.domain.dto.StockDto;

import java.util.List;

public interface StockService {
    List<StockDto> getAllStocks();
}
