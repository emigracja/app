package com.example.backend.api;

import com.example.backend.domain.dto.StockDto;
import com.example.backend.domain.service.StockService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class StockApi {
    private final StockService stockService;

    @GetMapping("/stock")
    public ResponseEntity<List<StockDto>> getStockService() {
        try{
            List<StockDto> list = stockService.getAllStocks();
            return ResponseEntity.ok(list);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}

