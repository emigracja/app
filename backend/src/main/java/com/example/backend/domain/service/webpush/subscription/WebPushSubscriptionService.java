package com.example.backend.domain.service.webpush.subscription;

import com.example.backend.domain.dto.PushSubscriptionDto;
import com.example.backend.domain.service.stock.StockService;
import com.example.backend.domain.service.user.UserService;
import com.example.backend.infrastructure.database.entity.UserEntity;
import com.example.backend.infrastructure.database.entity.WebPushSubscriptionEntity;
import com.example.backend.infrastructure.database.repository.StockJpaRepository;
import com.example.backend.infrastructure.database.repository.WebPushSubscriptionRepository;
import lombok.RequiredArgsConstructor;
import nl.martijndwars.webpush.Subscription;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class WebPushSubscriptionService {

    private final WebPushSubscriptionRepository webPushSubscriptionRepository;
    private final UserService userService;

    public void subscribe(PushSubscriptionDto subscriptionDto) {

        UserEntity user = userService.findUserById(subscriptionDto.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        WebPushSubscriptionEntity subscription =
                WebPushSubscriptionEntity.builder()
                        .endpoint(subscriptionDto.getEndpoint())
                        .p256dh(subscriptionDto.getP256dh())
                        .auth(subscriptionDto.getAuth())
                        .userEntity(user)
                        .build();

        webPushSubscriptionRepository.save(subscription);
    }

    public List<Subscription> findUsersSubscriptions(List<UserEntity> users) {
        return webPushSubscriptionRepository.findAllByUserEntityIn(users)
                .stream()
                .map(WebPushSubscriptionEntity::toWebPushSubscription)
                .toList();
    }

}
