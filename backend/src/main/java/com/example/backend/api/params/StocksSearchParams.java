package com.example.backend.api.params;

public record StocksSearchParams(
        String generalSearch,
        String stockName,
        String symbol,
        String country,
        String exchange,
        Integer size,
        Integer page
) {
    public static final String PARAM_SEARCH = "s";
    public static final String PARAM_NAME = "n";
    public static final String PARAM_SYMBOL = "symbol";
    public static final String PARAM_COUNTRY = "c";
    public static final String PARAM_EXCHANGE = "e";
    public static final String PARAM_PAGE = "page";
    public static final String PARAM_SIZE = "size";
}
