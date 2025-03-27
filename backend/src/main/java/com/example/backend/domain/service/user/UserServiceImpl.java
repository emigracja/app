package com.example.backend.domain.service.user;

import com.example.backend.domain.dto.UserDto;
import com.example.backend.domain.dto.mapper.UserMapper;
import com.example.backend.infrastructure.database.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void registerUser(UserDto userDto) {
        userDto.setPassword(passwordEncoder.encode(userDto.getPassword()));
        userRepository.save(UserMapper.map(userDto));
    }

    @Override
    public boolean authenticateUser(UserDto userDto) {
        var user = userRepository.findByUsername(userDto.getEmail());
        boolean isPasswordLegit = user != null && passwordEncoder.matches(userDto.getPassword(), user.getPassword());

        if (!isPasswordLegit) {
            return false;
        }

        user.setLastLogin(LocalDateTime.now());
        userRepository.save(user);
        return true;
    }
}
