package com.example.backend.domain.service.external.rss_fetcher.mapper;

import java.time.OffsetDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Date;
import java.util.Locale;

public class Common {
    public static Date parseRFC1123Date(String date) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("EEE, d MMM uuuu HH:mm:ss Z", Locale.ENGLISH);

        try {
            OffsetDateTime zonedDateTime = OffsetDateTime.parse(date, formatter);
            return Date.from(zonedDateTime.toInstant());
        } catch (Exception e) {
            return null;
        }
    }
}
