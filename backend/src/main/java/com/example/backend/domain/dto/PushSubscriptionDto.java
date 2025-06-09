package com.example.backend.domain.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonValue;
import lombok.*;

@Getter
@Setter
@ToString
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PushSubscriptionDto {
    private String endpoint;
    private String p256dh;
    private String auth;
    @JsonProperty("device_id")
    private String deviceId;
}