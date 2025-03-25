package com.example.backend.api;

import com.example.backend.domain.dto.ArticleStockImpactDto;
import com.example.backend.domain.service.impact.ArticleStockImpactService;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequiredArgsConstructor
public class ArticlesApi {
    private final ArticleStockImpactService stockImpactService;

    @PostMapping("/articles/{article_id}/stock-impacts")
    @Operation(summary = "Endpoint receives article sentiment data sent from the AI module")
    public ResponseEntity<String> processArticleStockImpact(@PathVariable("article_id") String articleId,
                                                            @Valid @RequestBody ArticleStockImpactDto request,
                                                            BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            return ResponseEntity.badRequest().body(bindingResult.getAllErrors().toString());
        }

        log.info("Received request for article {}: {}", articleId, request);
        try {
            if (articleId == null || articleId.isEmpty()) {
                return ResponseEntity.badRequest().body("Article id is required");
            }

            request.setArticleId(articleId);
            stockImpactService.processImpact(request);

            return ResponseEntity.ok().build();
        } catch (Exception e) {
            log.error("Error processing stock impact for article {}", articleId, e);
            return ResponseEntity.internalServerError().build();
        }
    }
}
