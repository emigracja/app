package com.example.backend.domain.service.user;

import com.example.backend.domain.dto.UserDto;

public interface UserService {
    void registerUser(UserDto userDto);

    boolean authenticateUser(UserDto userDto);
}
