package com.example.backend.domain.service.user;

import com.example.backend.domain.dto.AuthRequest;
import com.example.backend.domain.dto.UserDto;

import java.util.Optional;

public interface UserService {
    void registerUser(UserDto userDto);

    Optional<String> authenticateUser(AuthRequest authRequest);
}
