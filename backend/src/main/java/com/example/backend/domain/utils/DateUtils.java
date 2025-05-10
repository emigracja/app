package com.example.backend.domain.utils;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;

public class DateUtils {
    /**
     * Converts java.util.Date to java.time.LocalDateTime
     *
     * @param date Date object
     * @return LocalDateTime object
     */
    public static LocalDateTime toLocalDateTime(Date date) {
        if (date == null) return null;
        return Instant.ofEpochMilli(date.getTime())
                .atZone(ZoneId.systemDefault())
                .toLocalDateTime();
    }

    /**
     * Converts java.time.LocalDateTime to java.util.Date
     *
     * @param localDateTime LocalDateTime localDateTime
     * @return Date object
     */
    public static Date toDate(LocalDateTime localDateTime) {
        if (localDateTime == null) return null;
        return Date.from(localDateTime
                .atZone(ZoneId.systemDefault())
                .toInstant());
    }
}
