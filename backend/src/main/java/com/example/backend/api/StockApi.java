package com.example.backend.api;

import com.example.backend.domain.dto.StockDto;
import com.example.backend.domain.service.stock.StockService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Slf4j
@RestController
@RequiredArgsConstructor
public class StockApi {
    private final StockService stockService;

    @GetMapping("/stocks")
    @Operation(summary = "Providing a list of all stocks present in the database")
    public ResponseEntity<List<StockDto>> getStockService() {
        try{
            log.info("getStockService");
            List<StockDto> list = stockService.getAllStocks();
            return ResponseEntity.ok(list);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping("/stocks")
    @Operation(summary = "Adds a new stock if it does not exist in the database. If the stock is not found, it fetches " +
            "data from an external API based on the provided symbol and then saves it to the database.")
    public ResponseEntity<StockDto> addStock(@RequestBody StockDto stockDto) {
        if (stockDto == null || stockDto.getSymbol() == null || stockDto.getSymbol().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        log.info("addStock");
        try {
            StockDto savedStock = stockService.addStock(stockDto.getSymbol());
            return ResponseEntity.ok(savedStock);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }


}
