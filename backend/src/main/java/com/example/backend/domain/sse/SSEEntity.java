package com.example.backend.domain.sse;

import lombok.Builder;
import lombok.Getter;

@Builder
@Getter
public class SSEEntity {
    private String stockId;

    private String name;

    private String description;
}
