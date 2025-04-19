package com.example.backend.infrastructure.database;

import org.springframework.security.core.GrantedAuthority;

public enum USER_ROLE implements GrantedAuthority {
    ADMIN,
    USER;

    @Override
    public String getAuthority() {
        return name();
    }
}
