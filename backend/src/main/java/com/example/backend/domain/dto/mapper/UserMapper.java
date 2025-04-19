package com.example.backend.domain.dto.mapper;

import com.example.backend.domain.dto.UserDto;
import com.example.backend.infrastructure.database.entity.UserEntity;
import lombok.AccessLevel;
import lombok.NoArgsConstructor;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class UserMapper {

    public static UserDto map(UserEntity user) {
        return UserDto.builder()
                .password(user.getPassword())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .phone(user.getPhone())
                .build();
    }

    public static UserEntity map(UserDto userDto) {
        return UserEntity.builder()
                .password(userDto.getPassword())
                .email(userDto.getEmail())
                .firstName(userDto.getFirstName())
                .lastName(userDto.getLastName())
                .phone(userDto.getPhone())
                .build();
    }
}
