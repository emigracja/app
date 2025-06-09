package com.example.backend.infrastructure.database.repository;

import com.example.backend.domain.service.webpush.subscription.WebPushSubscriptionService;
import com.example.backend.infrastructure.database.entity.UserEntity;
import com.example.backend.infrastructure.database.entity.WebPushSubscriptionEntity;
import com.example.backend.infrastructure.database.entity.enums.NotificationSeverity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;


@Repository
public interface WebPushSubscriptionRepository extends JpaRepository<WebPushSubscriptionEntity, String> {

    @Query("SELECT w FROM WebPushSubscriptionEntity w WHERE w.userEntity IN :users AND w.isActive = true AND w.severityLevel > :severityLevel")
    List<WebPushSubscriptionEntity> findAllByUserEntityInAndActiveIsTrue(
            List<UserEntity> users,
            NotificationSeverity severityLevel
    );

    @Query("SELECT w FROM WebPushSubscriptionEntity w WHERE w.userEntity.id = ?1")
    List<WebPushSubscriptionEntity> findByUserId(@Param("id") String id);

    Optional<WebPushSubscriptionEntity> findByDeviceId(String deviceId);
}
