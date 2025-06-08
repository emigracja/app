package com.example.backend.infrastructure.database.entity;

import com.example.backend.infrastructure.database.entity.enums.NotificationSeverity;
import jakarta.persistence.*;
import lombok.*;
import nl.martijndwars.webpush.Subscription;

@Entity
@Table(name = "WEB_PUSH_SUBSCRIPTIONS")
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Getter
@Setter
public class WebPushSubscriptionEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    @Column(name = "p256dh", nullable = false)
    private String p256dh;
    @Column(name = "auth", nullable = false)
    private String auth;
    @Column(name= "endpoint", nullable = false)
    private String endpoint;
    @Column(name = "is_active", nullable = false)
    private boolean isActive = true;
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private UserEntity userEntity;
    @Column(name = "device_id", unique = true, nullable = false)
    private String deviceId;
    @Column(name = "severity_level", nullable = false)
    private NotificationSeverity severityLevel;

    public Subscription toWebPushSubscription() {
        return new Subscription(
                endpoint,
                new Subscription.Keys(this.p256dh, this.auth)
        );
    }
}
