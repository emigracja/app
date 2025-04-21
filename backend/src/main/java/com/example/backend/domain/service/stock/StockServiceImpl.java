package com.example.backend.domain.service.stock;

import com.example.backend.domain.dto.StockDto;
import com.example.backend.domain.dto.mapper.StockMapper;
import com.example.backend.infrastructure.database.entity.StockEntity;
import com.example.backend.infrastructure.database.entity.UserEntity;
import com.example.backend.infrastructure.database.repository.StockJpaRepository;
import com.example.backend.infrastructure.database.repository.UserJpaRepository;
import com.example.backend.infrastructure.exceptions.StockAlreadyAssociatedException;
import com.example.backend.infrastructure.exceptions.StockNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class StockServiceImpl implements StockService {
    private final StockJpaRepository stockJpaRepository;
    private final UserJpaRepository userJpaRepository;

    @Override
    public List<StockDto> getAllStocks() {
        return stockJpaRepository.findAll().stream().map(StockMapper::map).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<StockDto> getStocksForUser(String email) {
        UserEntity user = userJpaRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

        List<StockEntity> stocks = user.getStocks();

        return stocks.stream()
                .map(StockMapper::map)
                .toList();
    }

    @Override
    @Transactional
    public StockDto addStockToUser(String email, String symbol) throws StockAlreadyAssociatedException {

        UserEntity user = userJpaRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

        StockEntity stockToAdd = stockJpaRepository.findBySymbol(symbol)
                .orElseThrow(() -> new StockNotFoundException("Stock not found with symbol: " + symbol));

        boolean alreadyAssociated = user.getStocks().stream()
                .anyMatch(existingStock -> existingStock.getId().equals(stockToAdd.getId()));

        if (alreadyAssociated) {
            throw new StockAlreadyAssociatedException("Stock with symbol '" + symbol + "' is already associated with user '" + email + "'.");
        }

        user.getStocks().add(stockToAdd);

        log.info("Associated stock {} with user {}", stockToAdd.getId(), user.getId());

        return StockMapper.map(stockToAdd);
    }

}
