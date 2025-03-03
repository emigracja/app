package com.example.backend.api;

import com.example.backend.domain.dto.StockDto;
import com.example.backend.domain.dto.ArticleStockImpactDto;
import com.example.backend.domain.service.ArticleStockImpactService;
import com.example.backend.domain.service.StockService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequiredArgsConstructor
public class StockApi {
    private final StockService stockService;
    private final ArticleStockImpactService stockImpactService;

    @GetMapping("/stock")
    public ResponseEntity<List<StockDto>> getStockService() {
        try{
            List<StockDto> list = stockService.getAllStocks();
            return ResponseEntity.ok(list);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping("/article/impact")
    public ResponseEntity<String> processArticleStockImpact(@Valid @RequestBody ArticleStockImpactDto request,
                                                            BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            return ResponseEntity.badRequest().body(bindingResult.getAllErrors().toString());
        }

        log.info("Received request: {}", request);
        try {
            stockImpactService.processImpact(request);
            return ResponseEntity.ok().build();
        }catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}
