package com.example.backend.domain.service.stock;

import com.example.backend.domain.dto.StockDto;

public interface StockApiService {
    StockDto getStockBySymbol(String symbol);
}
