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
}
