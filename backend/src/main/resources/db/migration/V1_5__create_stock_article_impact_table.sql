CREATE TABLE article_stock_impacts
(
    id         VARCHAR(255) NOT NULL,
    article_id VARCHAR(255) NOT NULL,
    stock_id   VARCHAR(255) NOT NULL,
    impact     VARCHAR(255) NOT NULL,
    reason     VARCHAR(255),
    CONSTRAINT pk_article_stock_impact PRIMARY KEY (id),
    CONSTRAINT fk_article_stock_impacts_article FOREIGN KEY (article_id) REFERENCES articles (id) ON DELETE CASCADE,
    CONSTRAINT fk_article_stock_impacts_stock FOREIGN KEY (stock_id) REFERENCES stocks (id) ON DELETE CASCADE
);
