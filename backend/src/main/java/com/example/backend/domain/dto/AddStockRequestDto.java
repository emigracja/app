package com.example.backend.domain.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class AddStockRequestDto {
    @NotBlank(message = "Stock symbol cannot be blank")
    private String symbol;
}
