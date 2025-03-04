package com.example.backend.domain.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class StockDto {
    private String id;
    private String symbol;
    private String name;
    private String description;
    private String ekd;
    private String city;
    private String country;
}
