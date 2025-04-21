package com.example.backend.domain.service.user;

import com.example.backend.domain.dto.AuthRequest;
import com.example.backend.domain.dto.UserDto;
import com.example.backend.infrastructure.database.entity.UserEntity;

import java.util.List;
import java.util.Optional;

public interface UserService {
    void registerUser(UserDto userDto);

    Optional<String> authenticateUser(AuthRequest authRequest);

    Optional<UserEntity> findUserById(String id);

    List<UserEntity> findAllByStocksId(String stockId);
}
