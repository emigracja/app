package com.example.backend.domain.service.webpush.dto;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.Builder;
import lombok.Getter;
import lombok.SneakyThrows;

@Getter
@Builder
public class Message {
    private String title;
    private String description;
    private String stock;

    @SneakyThrows
    public String toJson() {
        ObjectMapper mapper = new ObjectMapper();
        return mapper.writeValueAsString(this);
    }
}
