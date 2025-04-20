package com.example.backend.api;

import com.example.backend.domain.sse.SSEEntity;
import com.example.backend.domain.sse.SSEEventProcessor;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

@RestController("/topic")
@RequiredArgsConstructor
public class SSEController {

    private final SSEEventProcessor sseEventProcessor;

    @GetMapping("/subscribe/{stockId}")
    public SseEmitter subscribe(@PathVariable String stockId) {
        return sseEventProcessor.createSSEEmitter(stockId);
    }

    @GetMapping("/emit/{stockId}")
    public void emit(@PathVariable String stockId) {

        SSEEntity entity = SSEEntity.builder()
                .stockId(stockId)
                .name("Stock Name")
                .description("Stock Description")
                .build();

        sseEventProcessor.emit(entity);
    }
}
