package com.example.backend.api;

import com.example.backend.domain.dto.AddStockRequestDto;
import com.example.backend.domain.dto.StockDto;
import com.example.backend.domain.service.stock.StockService;
import com.example.backend.infrastructure.annotations.RequireNotEmptyEmail;
import com.example.backend.infrastructure.exceptions.StockAlreadyAssociatedException;
import com.example.backend.infrastructure.exceptions.StockNotFoundException;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;
import java.util.List;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequireNotEmptyEmail
public class StockController {
    public static final String ALL_STOCKS = "/stocks";
    public static final String USER_STOCKS = "/user/stocks";

    private final StockService stockService;

    @GetMapping(ALL_STOCKS)
    @Operation(summary = "Get a list of all stocks from the database",
            description = "Returns a list of all stock entries. This endpoint does not support filters.",
            responses = {
                    @ApiResponse(responseCode = "200",
                            description = "Successfully retrieved list of stocks",
                            content = @Content(
                                    mediaType = "application/json", schema = @Schema(implementation = StockDto.class)
                            )),
                    @ApiResponse(responseCode = "403", description = "Access denied – insufficient permissions"),
                    @ApiResponse(responseCode = "500", description = "Internal server error")
            }
    )
    public ResponseEntity<List<StockDto>> getStocks() {
        try {
            log.info("getStocks");
            List<StockDto> list = stockService.getAllStocks();
            return ResponseEntity.ok(list);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping(USER_STOCKS)
    @Operation(summary = "Get a list of stocks associated with the current user",
            description = "Returns a list of all stocks owned or tracked by the currently authenticated user.",
            responses = {
                    @ApiResponse(responseCode = "200",
                            description = "Successfully retrieved list of user stocks",
                            content = @Content(
                                    mediaType = "application/json", schema = @Schema(implementation = StockDto.class)
                            )),
                    @ApiResponse(responseCode = "403", description = "Access denied – user not authorized or token invalid"),
                    @ApiResponse(responseCode = "500", description = "Internal server error")
            }
    )
    public ResponseEntity<List<StockDto>> getUserStocks(Principal principal) {
        String email = principal.getName();
        log.info("Attempting to get stocks for user: {}", email);

        try {
            List<StockDto> userStocks = stockService.getStocksForUser(email);
            log.info("Successfully retrieved {} stocks for user: {}", userStocks.size(), email);
            return ResponseEntity.ok(userStocks);
        } catch (UsernameNotFoundException e) {
            log.error("User not found for username obtained from token: {}", email, e);
            return ResponseEntity.status(403).build();
        } catch (Exception e) {
            log.error("Error retrieving stocks for user: {}", email, e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping(USER_STOCKS)
    @Operation(summary = "Add a stock to the current user's list",
            description = "Associates a stock, identified by its symbol, with the currently authenticated user.",
            responses = {
                    @ApiResponse(responseCode = "200",
                            description = "Stock successfully associated with the user",
                            content = @Content(
                                    mediaType = "application/json", schema = @Schema(implementation = StockDto.class)
                            )),
                    @ApiResponse(responseCode = "400", description = "Invalid request data (e.g., missing symbol)"),
                    @ApiResponse(responseCode = "401", description = "Unauthorized - User not authenticated"),
                    @ApiResponse(responseCode = "403", description = "Forbidden - User cannot be identified from token"),
                    @ApiResponse(responseCode = "404", description = "Stock with the given symbol not found"),
                    @ApiResponse(responseCode = "409", description = "Stock is already associated with this user"),
                    @ApiResponse(responseCode = "500", description = "Internal server error")
            }
    )
    public ResponseEntity<?> addStockToUser(Principal principal, @Valid @RequestBody AddStockRequestDto requestDto) {
        String email = principal.getName();
        String stockSymbol = requestDto.getSymbol();

        log.info("Attempting to add stock with symbol '{}' for user '{}'", stockSymbol, email);

        try {
            StockDto addedStock = stockService.addStockToUser(email, stockSymbol);
            log.info("Successfully added stock '{}' for user '{}'", stockSymbol, email);
            return ResponseEntity.ok(addedStock);
        } catch (UsernameNotFoundException e) {
            log.error("User not found for username obtained from token: {}", email, e);
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("User specified in token not found.");
        } catch (StockNotFoundException e) {
            log.warn("Stock not found with symbol '{}' for user '{}'", stockSymbol, email, e);
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(e.getMessage());
        } catch (StockAlreadyAssociatedException e) {
            log.warn("Stock '{}' already associated with user '{}'", stockSymbol, email, e);
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(e.getMessage());
        } catch (Exception e) {
            log.error("Error adding stock '{}' for user '{}'", stockSymbol, email, e);
            return ResponseEntity.internalServerError().body("An unexpected error occurred.");
        }
    }
}
