package com.example.backend.api.params;

public record ArticleSearchParams(
        String generalSearch,
        String articleName,
        String dateFrom,
        String dateTo,
        String stockName,
        Integer pageNumber,
        Integer size
) {
    public static final String PARAM_SEARCH = "s";
    public static final String PARAM_NAME = "n";
    public static final String PARAM_DATE_FROM = "from";
    public static final String PARAM_DATE_TO = "to";
    public static final String PARAM_STOCK = "r";
    public static final String PARAM_PAGE = "page";
}
