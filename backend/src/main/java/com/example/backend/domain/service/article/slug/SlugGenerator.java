package com.example.backend.domain.service.article.slug;

import java.text.Normalizer;
import java.util.Locale;
import java.util.regex.Pattern;

public class SlugGenerator {

    private static final Pattern LEADING_TRAILING_HYPHENS = Pattern.compile("^-|-$");

    public static String createSlugFromTitle(String title) {
        if (title == null || title.trim().isEmpty()) {
            return "";
        }

        String normalized = normalizeDiacritics(title);

        normalized = normalized.replace('Ł', 'L').replace('ł', 'l');

        String lowercased = normalized.toLowerCase(Locale.ENGLISH);

        String replacedChars = lowercased.replaceAll("[^a-z0-9]+", "-");

       return LEADING_TRAILING_HYPHENS.matcher(replacedChars).replaceAll("");

    }

    private static String normalizeDiacritics(String input) {
        if (input == null) {
            return null;
        }
        String normalized = Normalizer.normalize(input, Normalizer.Form.NFD);
        return normalized.replaceAll("\\p{M}", "");
    }
}