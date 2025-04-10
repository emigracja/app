package com.example.backend.api;

import com.example.backend.api.params.ArticleSearchParams;
import com.example.backend.domain.dto.ArticleDto;
import com.example.backend.domain.dto.ArticleStockImpactDto;
import com.example.backend.domain.service.article.ArticleService;
import com.example.backend.domain.service.impact.ArticleStockImpactService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static com.example.backend.api.params.ArticleSearchParams.*;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/articles")
public class ArticlesApi {
    private final ArticleStockImpactService stockImpactService;
    private final ArticleService articleService;

    @Operation(
            summary = "Get all articles with optional filtering",
            description = "Retrieves articles with support for various filter parameters",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Successfully retrieved articles", content = @Content(mediaType = "application/json", schema = @Schema(implementation = ArticleDto.class))),
                    @ApiResponse(responseCode = "400", description = "Invalid parameters provided")
            }
    )
    @GetMapping
    public ResponseEntity<List<ArticleDto>> getAllArticles(
            @Parameter(description = "General search term")
            @RequestParam(name = PARAM_SEARCH, required = false) String generalSearch,

            @Parameter(description = "Search by article name")
            @RequestParam(name = PARAM_NAME, required = false) String articleName,

            @Parameter(description = "Filter articles from this date (yyyy-MM-dd)")
            @RequestParam(name = PARAM_DATE_FROM, required = false) String dateFrom,

            @Parameter(description = "Filter articles to this date (yyyy-MM-dd)")
            @RequestParam(name = PARAM_DATE_TO, required = false) String dateTo,

            @Parameter(description = "Filter by stock name")
            @RequestParam(name = PARAM_STOCK, required = false) String stockName,

            @Parameter(description = "Page number for pagination")
            @RequestParam(name = PARAM_PAGE, required = false, defaultValue = "0") Integer pageNumber,

            @Parameter(description = "Page size for pagination")
            @RequestParam(name = "size", required = false, defaultValue = "10") Integer size
    ) {
        return ResponseEntity.ok(articleService.findAllBySearchParams(new ArticleSearchParams(
                generalSearch,
                articleName,
                dateFrom,
                dateTo,
                stockName,
                pageNumber,
                size
        )));
    }

    @GetMapping("/{article_id}")
    @Operation(
            summary = "Retrieve an article by its ID",
            description = "Fetches the article details for the given article ID. Returns a 404 status if the article is not found.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Article found", content = @Content(mediaType = "application/json", schema = @Schema(implementation = ArticleDto.class))),
                    @ApiResponse(responseCode = "404", description = "Article not found")
            }
    )
    public ResponseEntity<ArticleDto> getArticle(@PathVariable("article_id") String articleId) {
        return articleService.findById(articleId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }


    @PostMapping("/{article_id}/stock-impacts")
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
