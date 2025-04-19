package com.example.backend.domain.service.stock;

import com.example.backend.domain.dto.StockDto;
import com.example.backend.infrastructure.exceptions.StockAlreadyAssociatedException;

import java.util.List;

public interface StockService {
    List<StockDto> getAllStocks();

    List<StockDto> getStocksForUser(String email);

    StockDto addStockToUser(String username, String stockSymbol) throws StockAlreadyAssociatedException;
}
