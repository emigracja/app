package com.example.backend.domain.service.external.alpha_vantage.service;

import com.example.backend.domain.dto.StockDto;
import com.example.backend.domain.service.external.alpha_vantage.mapper.AlphaVantageMapper;
import com.example.backend.domain.service.stock.StockApiService;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;
import org.jetbrains.annotations.Nullable;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.Map;

@Slf4j
@Service
@Setter
public class AlphaVantageFetcher implements StockApiService {
    private static final String OVERVIEW = "OVERVIEW";

    @Value("${ALPHA_VANTAGE_URL}")
    private String baseUrl;

    @Value("${ALPHA_VANTAGE_API_KEY}")
    private String apiKey;

    @Override
    public StockDto getStockBySymbol(String symbol) {
        try {
            log.info("getStockBySymbol: {}", symbol);
            Map<String, String> responseMap = getResponseMap(symbol, OVERVIEW);

            assert responseMap != null;
            StockDto stockDto = AlphaVantageMapper.mapToStockDto(responseMap);
            if (stockDto.getSymbol().isEmpty() || stockDto.getName().isEmpty()) {
                throw new RuntimeException("Could not get stock by symbol!");
            }
            return stockDto;
        } catch (Exception e) {
            throw new RuntimeException("Error fetching stock data", e);
        }
    }

    @Nullable
    private Map<String, String> getResponseMap(String symbol, String functionType) {
        return WebClient.builder()
                .baseUrl(baseUrl)
                .build()
                .get()
                .uri(uriBuilder -> uriBuilder
                        .queryParam("function", functionType)
                        .queryParam("symbol", symbol)
                        .queryParam("apikey", apiKey)
                        .build())
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<Map<String, String>>() {
                })
                .block();
    }

}
