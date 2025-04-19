package com.example.backend.infrastructure.exceptions;

public class StockAlreadyAssociatedException extends Throwable {
    public StockAlreadyAssociatedException(String message) {
        super(message);
    }
}
