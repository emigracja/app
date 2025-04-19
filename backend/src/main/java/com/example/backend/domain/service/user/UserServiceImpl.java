package com.example.backend.domain.service.user;

import com.example.backend.domain.dto.AuthRequest;
import com.example.backend.domain.dto.UserDto;
import com.example.backend.domain.dto.mapper.UserMapper;
import com.example.backend.infrastructure.config.security.jwt.JwtUtils;
import com.example.backend.infrastructure.database.entity.UserEntity;
import com.example.backend.infrastructure.database.repository.UserJpaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final UserJpaRepository userJpaRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;

    @Override
    public void registerUser(UserDto userDto) {
        userDto.setPassword(passwordEncoder.encode(userDto.getPassword()));
        userJpaRepository.save(UserMapper.map(userDto));
    }

    @Override
    public Optional<String> authenticateUser(AuthRequest authRequest) {
        Optional<UserEntity> optionalUser = userJpaRepository.findByEmail(authRequest.email());

        if (optionalUser.isEmpty()) {
            return Optional.empty();
        }
        UserEntity userEntity = optionalUser.get();

        boolean isPasswordLegit = passwordEncoder.matches(authRequest.password(), userEntity.getPassword());
        if (!isPasswordLegit) {
            return Optional.empty();
        }

        userEntity.setLastLogin(LocalDateTime.now());
        userJpaRepository.save(userEntity);

        return Optional.of(jwtUtils.generateToken(userEntity));
    }

}
