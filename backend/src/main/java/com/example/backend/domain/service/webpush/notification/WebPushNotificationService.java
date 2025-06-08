package com.example.backend.domain.service.webpush.notification;

import com.example.backend.domain.service.webpush.dto.Message;
import com.example.backend.domain.service.webpush.subscription.WebPushSubscriptionService;
import com.example.backend.infrastructure.database.entity.ArticleEntity;
import com.example.backend.infrastructure.database.entity.ArticleStockImpactEntity;
import com.example.backend.infrastructure.database.entity.StockEntity;
import com.example.backend.infrastructure.database.entity.UserEntity;
import com.example.backend.infrastructure.database.entity.enums.NotificationSeverity;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import nl.martijndwars.webpush.Notification;
import nl.martijndwars.webpush.PushService;
import nl.martijndwars.webpush.Subscription;
import org.jose4j.lang.JoseException;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.security.GeneralSecurityException;
import java.util.List;
import java.util.concurrent.ExecutionException;

@Service
@RequiredArgsConstructor
@Slf4j
public class WebPushNotificationService {

    private final PushService pushService;
    private final WebPushSubscriptionService webPushSubscriptionService;

    public void notifyAll(List<UserEntity> users, String payloadJson, NotificationSeverity severity) {
        webPushSubscriptionService.findUsersSubscriptions(users, severity)
                .forEach(subscription -> notify(subscription, payloadJson));
    }

    public void notify(Subscription subscription, String payloadJson) {
        try {
            pushService.send(new Notification(subscription, payloadJson));
        } catch (GeneralSecurityException | IOException | JoseException | InterruptedException e) {
            log.error("Error sending notification: {}", e.getMessage());
        } catch (ExecutionException e) {
            throw new RuntimeException(e);
        }
    }

    public String prepareMessage(ArticleStockImpactEntity articleStockImpactEntity) {

        StockEntity stock = articleStockImpactEntity.getStock();
        ArticleEntity article = articleStockImpactEntity.getArticle();

        return Message.builder()
                .stock(stock.getSymbol())
                .description(article.getDescription())
                .title(article.getTitle())
                .build()
                .toJson();
    }
}
