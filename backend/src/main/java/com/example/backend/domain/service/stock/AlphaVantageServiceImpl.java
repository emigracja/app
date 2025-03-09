package com.example.backend.domain.service.stock;

import com.example.backend.domain.dto.StockDto;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.Map;

@Slf4j
@Service
@Setter
public class AlphaVantageServiceImpl implements StockApiService {
    private static final String OVERVIEW = "OVERVIEW";

    @Value("${ALPHA_VANTAGE_URL}")
    private String baseUrl;

    @Value("${ALPHA_VANTAGE_API_KEY}")
    private String apiKey;

    @Override
    public StockDto getStockBySymbol(String symbol) {
        try {
            log.info("getStockBySymbol: {}", symbol);
            Map<String, String> responseMap = WebClient.builder()
                    .baseUrl(baseUrl)
                    .build()
                    .get()
                    .uri(uriBuilder -> uriBuilder
                            .queryParam("function", OVERVIEW)
                            .queryParam("symbol", symbol)
                            .queryParam("apikey", apiKey)
                            .build())
                    .retrieve()
                    .bodyToMono(new ParameterizedTypeReference<Map<String, String>>() {
                    })
                    .block();

            assert responseMap != null;
            return mapToStockDto(responseMap);
        } catch (Exception e) {
            throw new RuntimeException("Error fetching stock data", e);
        }
    }

    private static StockDto mapToStockDto(Map<String, String> map) {
        return StockDto.builder()
                .name(map.getOrDefault("Name", ""))
                .symbol(map.getOrDefault("Symbol", ""))
                .ekd(map.getOrDefault("Sector", ""))
                .address(map.getOrDefault("Address", ""))
                .country(map.getOrDefault("Country", ""))
                .description(map.getOrDefault("Description", ""))
                .exchange(map.getOrDefault("Exchange", ""))
                .build();
    }
}
