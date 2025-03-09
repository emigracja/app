CREATE TABLE stocks
(
    id          VARCHAR(255) NOT NULL,
    symbol      VARCHAR(255) NOT NULL,
    name        VARCHAR(255) NOT NULL,
    description TEXT,
    ekd         VARCHAR(255) NOT NULL,
    country     VARCHAR(255) NOT NULL,
    address     VARCHAR(255) NOT NULL,
    exchange    VARCHAR(255) NOT NULL,
    CONSTRAINT pk_stocks PRIMARY KEY (id)
);

ALTER TABLE stocks
    ADD CONSTRAINT uc_stocks_symbol UNIQUE (symbol);