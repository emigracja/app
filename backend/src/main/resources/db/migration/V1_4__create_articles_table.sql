CREATE TABLE articles
(
    id             VARCHAR(255) NOT NULL,
    title          VARCHAR(255) NOT NULL,
    description    TEXT         NOT NULL,
    published_at   TIMESTAMP    NOT NULL,
    author         VARCHAR(255),
    article_source VARCHAR(255),
    url            VARCHAR(255),
    CONSTRAINT pk_article PRIMARY KEY (id)
);