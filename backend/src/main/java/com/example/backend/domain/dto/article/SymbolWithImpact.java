package com.example.backend.domain.dto.article;

import lombok.*;

@Setter
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class SymbolWithImpact {
    String symbol;
    String impact;
}
