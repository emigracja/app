package com.example.backend.domain.dto;

import lombok.*;

@Setter
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class StockDto {
    private String id;
    private String name;
    private String symbol;
    private String description;
    private String country;
    private String ekd;
    private String address;
    private String exchange;
}
