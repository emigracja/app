package com.example.backend.domain.service.webpush.subscription;

import com.example.backend.domain.dto.PushSubscriptionDto;
import com.example.backend.domain.service.user.UserService;
import com.example.backend.infrastructure.database.entity.UserEntity;
import com.example.backend.infrastructure.database.entity.WebPushSubscriptionEntity;
import com.example.backend.infrastructure.database.entity.enums.NotificationSeverity;
import com.example.backend.infrastructure.database.repository.WebPushSubscriptionRepository;
import jakarta.transaction.Transactional;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import nl.martijndwars.webpush.Subscription;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.print.attribute.standard.Severity;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class WebPushSubscriptionService {

    private final WebPushSubscriptionRepository webPushSubscriptionRepository;
    private final UserService userService;

    @Getter
    @Value("${vapid.public.key}")
    private String publicKey;

    public void subscribe(PushSubscriptionDto subscriptionDto, String email) {
        log.info("Attempting to create a new web push subscription for user: {}", email);

        UserEntity user = userService.findUserByEmail(email);

        WebPushSubscriptionEntity subscription =
                WebPushSubscriptionEntity.builder()
                        .endpoint(subscriptionDto.getEndpoint())
                        .isActive(true)
                        .deviceId(subscriptionDto.getDeviceId())
                        .p256dh(subscriptionDto.getP256dh())
                        .auth(subscriptionDto.getAuth())
                        .severityLevel(NotificationSeverity.LOW)
                        .userEntity(user)
                        .build();

        webPushSubscriptionRepository.save(subscription);
        log.info("Successfully saved web push subscription for user: {}. Endpoint: {}", email, subscription.getEndpoint());
    }

    public List<Subscription> findUsersSubscriptions(List<UserEntity> users, NotificationSeverity severity) {
        log.info("Searching for web push subscriptions for {} user(s).", users.size());
        List<WebPushSubscriptionEntity> subscriptions = webPushSubscriptionRepository.findAllByUserEntityInAndActiveIsTrue(users, severity);
        log.info("Found {} total web push subscription(s) for the provided users.", subscriptions.size());
        return subscriptions
                .stream()
                .map(WebPushSubscriptionEntity::toWebPushSubscription)
                .toList();
    }

    public List<WebPushSubscriptionEntity> updateSeverityLevel(String email, String severity){
        log.info("Updating severity level for user: {}", email);
        UserEntity user = userService.findUserByEmail(email);

        List<WebPushSubscriptionEntity> subscriptions = webPushSubscriptionRepository.findByUserId(user.getId());

        subscriptions
                .forEach(subscription -> {
                    subscription.setSeverityLevel(NotificationSeverity.fromValue(severity));
                });

        return subscriptions;
    }
    @Transactional
    public List<WebPushSubscriptionEntity> activate(String userId) {
        log.info("Searching for web push subscription with device ID: {}", userId);

        List<WebPushSubscriptionEntity> subscriptions = webPushSubscriptionRepository.findByUserId(userId);

        subscriptions
                .forEach(subscription -> {
                    subscription.setActive(true);
                });

        return subscriptions;
    }

    @Transactional
    public List<WebPushSubscriptionEntity> unsubscribe(String email) {
        log.info("Attempting to unsubscribe user: {}", email);
        UserEntity user = userService.findUserByEmail(email);

        List<WebPushSubscriptionEntity> subscriptions = webPushSubscriptionRepository.findByUserId(user.getId());


        subscriptions
                .forEach(subscription -> {
                    subscription.setActive(false);
                });

        return subscriptions;
    }
}