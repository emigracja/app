// src/main/java/com/example/backend/infrastructure/database/entity/enums/NotificationSeverity.java
package com.example.backend.infrastructure.database.entity.enums;

import java.util.stream.Stream;

public enum NotificationSeverity {

    SEVERE("severe", 4),
    HIGH("high", 3),
    MEDIUM("medium", 2),
    LOW("low", 1),
    NONE("none", 0);

    private final String value;
    private final int level;

    NotificationSeverity(String value, int level) {
        this.value = value;
        this.level = level;
    }

    public String getValue() {
        return value;
    }

    public int getLevel() {
        return level;
    }
    public static NotificationSeverity fromValue(String value) {
        if (value == null) {
            throw new IllegalArgumentException("Severity value cannot be null");
        }
        return Stream.of(NotificationSeverity.values())
                .filter(level -> level.value.equalsIgnoreCase(value))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Unknown severity level: '" + value + "'"));
    }

    public static NotificationSeverity fromLevel(int level) {
        return Stream.of(NotificationSeverity.values())
                .filter(sev -> sev.getLevel() == level)
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Unknown severity level: '" + level + "'"));
    }
}