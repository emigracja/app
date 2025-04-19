package com.example.backend.infrastructure.database.entity;

import com.example.backend.infrastructure.database.USER_ROLE;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "USERS")
public class UserEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(name = "password", nullable = false)
    private String password;

    @Column(name = "email", unique = true, nullable = false)
    private String email;

    @Column(name = "first_name", nullable = false)
    private String firstName;

    @Column(name = "last_name", nullable = false)
    private String lastName;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "last_login")
    private LocalDateTime lastLogin;

    @Enumerated(EnumType.STRING)
    @Column(name = "role", nullable = false)
    private USER_ROLE role;

    @Column(name = "is_active", nullable = false)
    private boolean isActive;

    @Column(name = "phone")
    private String phone;

    @ManyToMany
    @JoinTable(
            name = "user_stocks",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "stock_id")
    )
    private List<StockEntity> stocks;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        role = USER_ROLE.USER;
        isActive = true;
    }
}