package com.example.backend.domain.service.user;

import com.example.backend.infrastructure.database.entity.UserEntity;
import com.example.backend.infrastructure.database.repository.UserJpaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {
    private final UserJpaRepository userJpaRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Optional<UserEntity> byEmail = userJpaRepository.findByEmail(email);

        if (byEmail.isEmpty()) {
            throw new UsernameNotFoundException("User not found with email: " + email);
        }

        UserEntity user = byEmail.get();
        return org.springframework.security.core.userdetails.User.builder()
                .username(email)
                .password(user.getPassword())
                .authorities(user.getRole().getAuthority())
                .build();
    }
}
