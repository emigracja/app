package com.example.backend.infrastructure.database.entity.converter;

import com.example.backend.infrastructure.database.entity.enums.NotificationSeverity;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class NotificationSeverityConverter implements AttributeConverter<NotificationSeverity, Integer> {


    @Override
    public Integer convertToDatabaseColumn(NotificationSeverity attribute) {
        if (attribute == null) {
            return null;
        }
        return attribute.getLevel();
    }

    @Override
    public NotificationSeverity convertToEntityAttribute(Integer dbData) {
        if (dbData == null) {
            return null;
        }
        return NotificationSeverity.fromLevel(dbData);
    }
}
