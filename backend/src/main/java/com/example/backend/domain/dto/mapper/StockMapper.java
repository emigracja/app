package com.example.backend.domain.dto.mapper;

import com.example.backend.domain.dto.StockDto;
import com.example.backend.infrastructure.database.entity.StockEntity;
import lombok.AccessLevel;
import lombok.NoArgsConstructor;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class StockMapper {

    public static StockDto map(StockEntity stockEntity) {
        return StockDto.builder()
                .id(stockEntity.getId())
                .name(stockEntity.getName())
                .symbol(stockEntity.getSymbol())
                .description(stockEntity.getDescription())
                .ekd(stockEntity.getEkd())
                .country(stockEntity.getCountry())
                .address(stockEntity.getAddress())
                .exchange(stockEntity.getExchange())
                .build();
    }

    public static StockEntity map(StockDto stockDto) {
        return StockEntity.builder()
                .id(stockDto.getId())
                .name(stockDto.getName())
                .symbol(stockDto.getSymbol())
                .description(stockDto.getDescription())
                .ekd(stockDto.getEkd())
                .country(stockDto.getCountry())
                .address(stockDto.getAddress())
                .exchange(stockDto.getExchange())
                .build();
    }
}
