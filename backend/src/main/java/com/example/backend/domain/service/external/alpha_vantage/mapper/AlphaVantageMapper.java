package com.example.backend.domain.service.external.alpha_vantage.mapper;

import com.example.backend.domain.dto.StockDto;
import lombok.AccessLevel;
import lombok.NoArgsConstructor;

import java.util.Map;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class AlphaVantageMapper {

    public static StockDto mapToStockDto(Map<String, String> map) {
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
