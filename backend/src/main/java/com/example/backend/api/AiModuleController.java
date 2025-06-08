package com.example.backend.api;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.client.MultipartBodyBuilder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/ai")
@AllArgsConstructor
@Slf4j
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class AiModuleController {

    private static final String AI_URL = "http://ai:5000";
    private static final String VOICE_TO_TEXT_ENDPOINT = "/commands/transcribe";
    private static final String HARDCODED_MODEL = "gpt-4o-transcribe"; // Define model as a constant

    private final WebClient webClient;

    @PostMapping("/transcribe")
    public Mono<String> voiceToText(@RequestParam("file") MultipartFile file) {

        if (file.isEmpty()) {
            return Mono.error(new IllegalArgumentException("Received an empty file."));
        }

        String originalFilename = file.getOriginalFilename();
        log.info("Received file '{}'. Forwarding to AI module with model '{}'.", originalFilename, HARDCODED_MODEL);

        MultipartBodyBuilder bodyBuilder = new MultipartBodyBuilder();
        bodyBuilder.part("file", file.getResource());

        return webClient.mutate()
                .baseUrl(AI_URL)
                .build()
                .post()
                .uri(uriBuilder -> uriBuilder
                        .path(VOICE_TO_TEXT_ENDPOINT)
                        .queryParam("filename", originalFilename)
                        .queryParam("model", HARDCODED_MODEL)
                        .build())
                .body(BodyInserters.fromMultipartData(bodyBuilder.build()))
                .retrieve()
                .bodyToMono(String.class)
                .doOnSuccess(responseText -> log.info("Successfully received transcription: {}", responseText))
                .doOnError(error -> log.error("Error forwarding file to AI module: {}", error.getMessage()));
    }
}