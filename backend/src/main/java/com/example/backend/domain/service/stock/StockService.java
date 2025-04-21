package com.example.backend.domain.service.stock;

import com.example.backend.domain.dto.StockDto;
import com.example.backend.infrastructure.exceptions.StockAlreadyAssociatedException;

import javax.swing.text.html.Option;
import java.util.List;
import java.util.Optional;

public interface StockService {
    List<StockDto> getAllStocks();

    List<StockDto> getStocksForUser(String email);

    StockDto addStockToUser(String username, String stockSymbol) throws StockAlreadyAssociatedException;
}
