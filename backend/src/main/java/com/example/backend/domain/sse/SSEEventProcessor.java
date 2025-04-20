package com.example.backend.domain.sse;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.TimeUnit;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

@Component
public class SSEEventProcessor {

    private static final long SSE_TIMEOUT = TimeUnit.MINUTES.toMillis(30);
    private final Map<String, SseEmitter> sseEmitters = new ConcurrentHashMap<>();

    public SseEmitter createSSEEmitter(String indexId) {
        SseEmitter sseEmitter = new SseEmitter(SSE_TIMEOUT);

        Runnable removeEmitter = () -> this.sseEmitters.remove(indexId, sseEmitter);
        sseEmitter.onCompletion(removeEmitter);
        sseEmitter.onTimeout(removeEmitter);

        sseEmitter.onError(e -> this.sseEmitters.remove(indexId, sseEmitter));

        this.sseEmitters.put(indexId, sseEmitter);
        return sseEmitter;
    }

    public void emit(SSEEntity entity) {
        String stockId = entity.getStockId();
        SseEmitter sseEmitter = sseEmitters.get(stockId);

        if (sseEmitter != null) {
            try {
                sseEmitter.send(SseEmitter.event().data(entity));
            } catch (IOException | IllegalStateException e) {
                this.sseEmitters.remove(stockId, sseEmitter);
            }
        }
    }
}