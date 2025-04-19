CREATE TABLE user_stocks
(
    user_id  VARCHAR(255) NOT NULL,
    stock_id VARCHAR(255) NOT NULL,
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    CONSTRAINT fk_stock FOREIGN KEY (stock_id) REFERENCES stocks (id) ON DELETE CASCADE,
    CONSTRAINT pk_user_stocks PRIMARY KEY (user_id, stock_id)
);