package com.example.backend.api.params;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public class ArticleSearchParams {
    public static final String PARAM_SEARCH = "s";
    public static final String PARAM_NAME = "n";
    public static final String PARAM_DATE_FROM = "from";
    public static final String PARAM_DATE_TO = "to";
    public static final String PARAM_STOCK = "r";
    public static final String PARAM_PAGE = "page";

    private final String generalSearch;
    private final String articleName;
    private final String dateFrom;
    private final String dateTo;
    private final String stockName;
    private final Integer pageNumber;
    private final Integer size;
}
