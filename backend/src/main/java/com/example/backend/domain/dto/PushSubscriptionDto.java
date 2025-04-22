package com.example.backend.domain.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@NoArgsConstructor
@ToString
public class PushSubscriptionDto {
    private String userId;
    private String endpoint;
    private String p256dh;
    private String auth;
}