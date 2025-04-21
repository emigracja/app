package com.example.backend.api;

import com.example.backend.domain.dto.PushSubscriptionDto;
import com.example.backend.domain.service.webpush.subscription.WebPushSubscriptionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Slf4j
@RequiredArgsConstructor
public class PushSubscriptionsController {

    private final WebPushSubscriptionService webPushSubscriptionService;

    @PostMapping("/subscribe")
    public ResponseEntity<Void> saveSubscription(@RequestBody PushSubscriptionDto subscriptionDto) {
        System.out.println("Subscription received: " + subscriptionDto.toString());

        webPushSubscriptionService.subscribe(subscriptionDto);

        return ResponseEntity.status(HttpStatus.CREATED).build();
    }
}
