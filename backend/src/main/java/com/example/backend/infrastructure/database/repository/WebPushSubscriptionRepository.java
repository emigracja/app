package com.example.backend.infrastructure.database.repository;

import com.example.backend.infrastructure.database.entity.UserEntity;
import com.example.backend.infrastructure.database.entity.WebPushSubscriptionEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface WebPushSubscriptionRepository extends JpaRepository<WebPushSubscriptionEntity, String> {

    List<WebPushSubscriptionEntity> findAllByUserEntityIn(List<UserEntity> users);

}
