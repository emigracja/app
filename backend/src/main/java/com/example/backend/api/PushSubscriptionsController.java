package com.example.backend.api;

import com.example.backend.domain.dto.PushSubscriptionDto;
import com.example.backend.domain.service.impact.ArticleStockImpactService;
import com.example.backend.domain.service.user.UserService;
import com.example.backend.domain.service.webpush.notification.WebPushNotificationService;
import com.example.backend.domain.service.webpush.subscription.WebPushSubscriptionService;
import com.example.backend.infrastructure.database.entity.ArticleStockImpactEntity;
import com.example.backend.infrastructure.database.entity.enums.NotificationSeverity;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.print.attribute.standard.Severity;
import java.security.Principal;
import java.util.List;

@RestController
@Slf4j
@RequiredArgsConstructor
@RequestMapping("/notifications")
@CrossOrigin(origins = "*", allowedHeaders = "*")
@Tag(name = "Push Subscriptions", description = "Endpoints for managing user push notification subscriptions.")
public class PushSubscriptionsController {

    private final WebPushSubscriptionService webPushSubscriptionService;
    private final WebPushNotificationService webpushNotificationService;
    private final UserService userService;
    private final ArticleStockImpactService articleStockImpactService;


    @Operation(summary = "Subscribe to push notifications", description = "Creates or updates a push notification subscription for the authenticated user.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Subscription created successfully", content = @Content),
            @ApiResponse(responseCode = "401", description = "Unauthorized", content = @Content)
    })
    @PostMapping("/subscribe")
    public ResponseEntity<Void> saveSubscription(
            @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    description = "The push subscription object obtained from the browser.",
                    required = true,
                    content = @Content(schema = @Schema(implementation = PushSubscriptionDto.class))
            )
            @RequestBody PushSubscriptionDto subscriptionDto,
            @Parameter(hidden = true) Principal principal
    ) {
        log.info("Received request to subscribe for user: {}", principal.getName());
        log.debug("Subscription details: {}", subscriptionDto);
        webPushSubscriptionService.subscribe(subscriptionDto, principal.getName());
        log.info("Successfully subscribed user: {}", principal.getName());
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @Operation(summary = "Unsubscribe from push notifications", description = "Removes the push notification subscription for the authenticated user.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully unsubscribed", content = @Content),
            @ApiResponse(responseCode = "401", description = "Unauthorized", content = @Content)
    })
    @DeleteMapping("/unsubscribe")
    public ResponseEntity<Void> unsubscribe(@Parameter(hidden = true) Principal principal) {
        if (principal == null) {
            log.warn("Unauthorized attempt to unsubscribe.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        String email = principal.getName();
        log.info("Received request to unsubscribe for user: {}", email);
        webPushSubscriptionService.unsubscribe(email);
        log.info("Successfully unsubscribed user: {}", email);

        return ResponseEntity.ok().build();
    }

    @GetMapping("/publicKey")
    @Operation(summary = "Get public key for push notifications", description = "Retrieves the public key used for push notifications.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Public key retrieved successfully", content = @Content(schema = @Schema(type = "string"))),
            @ApiResponse(responseCode = "500", description = "Internal server error", content = @Content)
    })
    public ResponseEntity<String> getPublicKey() {
        String publicKey = webPushSubscriptionService.getPublicKey();
        if (publicKey == null) {
            log.error("Failed to retrieve public key.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
        log.info("Public key retrieved successfully.");
        return ResponseEntity.ok(publicKey);
    }

    @GetMapping("/activate")
    @Operation(summary = "Activate push notification subscription", description = "Activates a push notification subscription for the user.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Subscription activated successfully", content = @Content),
            @ApiResponse(responseCode = "404", description = "Subscription not found", content = @Content),
            @ApiResponse(responseCode = "500", description = "Internal server error", content = @Content),
            @ApiResponse(responseCode = "401", description = "Unauthorized", content = @Content)
    })
    public ResponseEntity<String> activateSubscription(
            Principal principal
    ) {
        if (principal == null) {
            log.warn("Unauthorized attempt to activate subscription.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized access.");
        }
        String email = principal.getName();
        String userId = userService.findUserByEmail(email).getId();

        log.info("Activating push notification subscription for user ID: {}", userId);
        try {
            webPushSubscriptionService.activate(userId);
            log.info("Successfully activated subscription for user ID: {}", userId);
            return ResponseEntity.ok("Subscription activated successfully.");
        } catch (Exception e) {
            log.error("Failed to activate subscription for user ID: {}", userId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to activate subscription.");
        }
    }

    @PutMapping("/severityLevel/{level}")
    @Operation(summary = "Update severity level for push notifications", description = "Updates the severity level for the user's push notification subscription.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Severity level updated successfully", content = @Content),
            @ApiResponse(responseCode = "400", description = "Invalid severity level", content = @Content),
            @ApiResponse(responseCode = "401", description = "Unauthorized", content = @Content)
    })
    public ResponseEntity<String> updateSeverityLevel(
            @PathVariable String level,
            @Parameter(hidden = true) Principal principal
    ) {
        if (principal == null) {
            log.warn("Unauthorized attempt to update severity level.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized access.");
        }
        String email = principal.getName();
        log.info("Updating severity level for user: {}", email);

        try {
            webPushSubscriptionService.updateSeverityLevel(email, level);
            log.info("Successfully updated severity level for user: {}", email);
            return ResponseEntity.ok("Severity level updated successfully.");
        } catch (IllegalArgumentException e) {
            log.error("Invalid severity level provided: {}", level, e);
            return ResponseEntity.badRequest().body("Invalid severity level provided.");
        } catch (Exception e) {
            log.error("Failed to update severity level for user: {}", email, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to update severity level.");
        }
    }

    @GetMapping("/test")
    @Operation(summary = "Test endpoint for push notifications", description = "A test endpoint to verify push notification functionality.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Test successful", content = @Content),
            @ApiResponse(responseCode = "500", description = "Internal server error", content = @Content)
    })
    public ResponseEntity<String> testPushNotifications() {


      webpushNotificationService.notifyAll(
              List.of(userService.findUserByEmail("test@test.test")),

              webpushNotificationService.prepareMessage(
                      articleStockImpactService.getAnyImpact()
              ),
              NotificationSeverity.MEDIUM
      );

        log.info("Test push notification sent successfully.");
        return ResponseEntity.ok("Test push notification sent successfully.");
    }
}

