package com.example.backend.infrastructure.database.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;
import nl.martijndwars.webpush.Subscription;

@Entity
@Table(name = "WEB_PUSH_SUBSCRIPTIONS")
@AllArgsConstructor
@NoArgsConstructor
@Builder
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

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private UserEntity userEntity;

    public Subscription toWebPushSubscription() {
        return new Subscription(
                endpoint,
                new Subscription.Keys(this.p256dh, this.auth)
        );
    }
}
