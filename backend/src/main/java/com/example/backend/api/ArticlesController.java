package com.example.backend.api;

import com.example.backend.api.params.ArticleSearchParams;
import com.example.backend.api.response.CustomApiResponse;
import com.example.backend.domain.dto.ArticleDto;
import com.example.backend.domain.dto.ArticleStockImpactDto;
import com.example.backend.domain.service.article.ArticleService;
import com.example.backend.domain.service.impact.ArticleStockImpactService;
import com.example.backend.domain.service.user.UserService;
import com.example.backend.domain.service.webpush.notification.WebPushNotificationService;
import com.example.backend.infrastructure.annotations.RequireNotEmptyEmail;
import com.example.backend.infrastructure.database.entity.ArticleStockImpactEntity;
import com.example.backend.infrastructure.database.entity.UserEntity;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

import static com.example.backend.api.params.ArticleSearchParams.*;

@Slf4j
@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class ArticlesController {
    public static final String API_ARTICLES_PATH = "/articles";
    public static final String API_USER_ARTICLES_PATH = "/user/articles";

    private final ArticleStockImpactService stockImpactService;
    private final ArticleService articleService;
    private final UserService userService;
    private final WebPushNotificationService webPushNotificationService;

    @RequireNotEmptyEmail
    @Operation(
            summary = "Get all articles with optional filtering",
            description = "Retrieves articles with support for various filter parameters",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Successfully retrieved articles", content = @Content(mediaType = "application/json", schema = @Schema(implementation = ArticleDto.class))),
                    @ApiResponse(responseCode = "400", description = "Invalid parameters provided")
            }
    )
    @GetMapping(API_ARTICLES_PATH)
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

    @GetMapping(API_ARTICLES_PATH + "/slug/{slug}")
    @Operation(
            summary = "Retrieve an article by its slug",
            description = "Fetches the article details for the given slug. Returns a 404 status if the article is not found.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Article found", content = @Content(mediaType = "application/json", schema = @Schema(implementation = ArticleDto.class))),
                    @ApiResponse(responseCode = "404", description = "Article not found")
            }
    )
    public ResponseEntity<ArticleDto> getArticleBySlug(@PathVariable("slug") String slug) {
        return articleService.findBySlug(slug)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @RequireNotEmptyEmail
    @GetMapping(API_ARTICLES_PATH + "/{article_id}")
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


    @PostMapping(API_ARTICLES_PATH + "/{article_id}/stock-impacts")
    @Operation(
            summary = "Receive article sentiment data from AI module",
            description = "Receives sentiment analysis results for a given article, sent from the AI module. The data is processed and stored for further use.",
            requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    required = true,
                    description = "Sentiment data for a specific article",
                    content = @Content(schema = @Schema(implementation = String.class))
            ),
            responses = {
                    @ApiResponse(responseCode = "200",
                            description = "Sentiment data received and processed successfully",
                            content = @Content(
                                    mediaType = "application/json",
                                    schema = @Schema(implementation = String.class)
                            )),
                    @ApiResponse(responseCode = "400", description = "Invalid request – malformed or missing data"),
                    @ApiResponse(responseCode = "500", description = "Internal server error while processing sentiment data")
            }
    )
    public ResponseEntity<?> processArticleStockImpact(@PathVariable("article_id") String articleId,
                                                       @Valid @RequestBody ArticleStockImpactDto request,
                                                       BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            String errorMessage = bindingResult.getAllErrors().toString();
            return ResponseEntity.badRequest().body(new CustomApiResponse(
                    errorMessage, HttpStatus.BAD_REQUEST.value()
            ));
        }

        log.info("Received request for article {}: {}", articleId, request);
        try {
            if (articleId == null || articleId.isEmpty()) {
                return ResponseEntity.badRequest().body(new CustomApiResponse(
                        "Article id is required", HttpStatus.BAD_REQUEST.value()
                ));
            }

            request.setArticleId(articleId);
            ArticleStockImpactEntity impact = stockImpactService.processImpact(request);
            List<UserEntity> affectedUsers = userService.findAllByStocksId(request.getStockId());

            String payload = webPushNotificationService.prepareMessage(impact);

            webPushNotificationService.notifyAll(affectedUsers, payload);

            return ResponseEntity.ok().build();
        } catch (Exception e) {
            String errorMessage = "Error processing stock impact for article %s".formatted(articleId);
            log.error(errorMessage, e);
            return ResponseEntity.internalServerError()
                    .body(new CustomApiResponse(errorMessage, HttpStatus.INTERNAL_SERVER_ERROR.value()));
        }
    }

    @RequireNotEmptyEmail
    @Operation(
            summary = "Get authenticated user's articles with optional filtering",
            description = "Retrieves articles associated with the authenticated user, with support for various filter parameters.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Successfully retrieved user articles", content = @Content(mediaType = "application/json", schema = @Schema(implementation = ArticleDto.class))),
                    @ApiResponse(responseCode = "400", description = "Invalid parameters provided"),
                    @ApiResponse(responseCode = "401", description = "Unauthorized - User not authenticated"),
                    @ApiResponse(responseCode = "403", description = "Forbidden - User cannot be identified or access denied")
            }
    )
    @GetMapping(API_USER_ARTICLES_PATH)
    public ResponseEntity<?> getUserArticles(
            Principal principal,

            @Parameter(description = "General search term")
            @RequestParam(name = PARAM_SEARCH, required = false) String generalSearch,

            @Parameter(description = "Search by article name")
            @RequestParam(name = PARAM_NAME, required = false) String articleName,

            @Parameter(description = "Filter articles from this date (yyyy-MM-dd)")
            @RequestParam(name = PARAM_DATE_FROM, required = false) String dateFrom,

            @Parameter(description = "Filter articles to this date (yyyy-MM-dd)")
            @RequestParam(name = PARAM_DATE_TO, required = false) String dateTo,

            @Parameter(description = "Filter by stock symbol or name associated with the article")
            @RequestParam(name = PARAM_STOCK, required = false) String stockName,

            @Parameter(description = "Page number for pagination")
            @RequestParam(name = PARAM_PAGE, required = false, defaultValue = "0") Integer pageNumber,

            @Parameter(description = "Page size for pagination")
            @RequestParam(name = "size", required = false, defaultValue = "10") Integer size
    ) {
        String email = principal.getName();
        log.info("Attempting to get articles for user '{}' with filters: search={}, name={}, dateFrom={}, dateTo={}, stock={}, page={}, size={}",
                email, generalSearch, articleName, dateFrom, dateTo, stockName, pageNumber, size);

        try {
            ArticleSearchParams searchParams = new ArticleSearchParams(
                    generalSearch,
                    articleName,
                    dateFrom,
                    dateTo,
                    stockName,
                    pageNumber,
                    size
            );
            List<ArticleDto> articles = articleService.getArticlesForUser(searchParams, email);
            log.info("Successfully retrieved {} articles for user '{}'", articles.size(), email);
            return ResponseEntity.ok(articles);
        } catch (UsernameNotFoundException e) {
            String errorMessage = String.format("User '%s' not found", email);
            log.error(errorMessage, e);
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(new CustomApiResponse(
                    errorMessage, HttpStatus.FORBIDDEN.value()
            ));
        } catch (IllegalArgumentException e) {
            String message = "Invalid arguments provided for article search by user '%s': %s".formatted(email, e.getMessage());
            log.warn(message);
            return ResponseEntity.badRequest().body(new CustomApiResponse(message, HttpStatus.BAD_REQUEST.value()));
        } catch (Exception e) {
            String message = "Error retrieving articles for user '%s'".formatted(email);
            log.error(message, e);
            return ResponseEntity.internalServerError().body(message);
        }
    }

}