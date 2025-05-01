package com.example.backend.domain.service.article;

import com.example.backend.api.params.ArticleSearchParams;
import com.example.backend.domain.dto.ArticleDto;
import com.example.backend.domain.dto.mapper.ArticleMapper;
import com.example.backend.infrastructure.database.entity.ArticleEntity;
import com.example.backend.infrastructure.database.entity.ArticleStockImpactEntity;
import com.example.backend.infrastructure.database.entity.UserEntity;
import com.example.backend.infrastructure.database.repository.ArticleJpaRepository;
import com.example.backend.infrastructure.database.repository.UserJpaRepository;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class ArticleServiceImpl implements ArticleService {
    private final ArticleJpaRepository articleJpaRepository;
    private final UserJpaRepository userJpaRepository;

    @Override
    public List<ArticleDto> findAllBySearchParams(ArticleSearchParams params) {
        Pageable pageable = PageRequest.of(params.pageNumber(), params.size());
        return articleJpaRepository.findAll(createArticleSpecification(params), pageable)
                .stream()
                .map(ArticleMapper::map)
                .toList();
    }

    @Override
    public ArticleDto addArticle(ArticleDto articleDto) {
        ArticleEntity toSave = ArticleMapper.map(articleDto);
        try {
            ArticleEntity saved = articleJpaRepository.save(toSave);
            return ArticleMapper.map(saved);
        } catch (Exception e) {
            log.error(e.getMessage());
            return null;
        }
    }

    @Transactional
    @Override
    public List<ArticleDto> saveAll(List<ArticleDto> articles) {
        List<ArticleEntity> list = articles.stream().map(ArticleMapper::map).toList();

        List<ArticleEntity> articleEntities = articleJpaRepository.saveAll(list);

        return articleEntities.stream().map(ArticleMapper::map).toList();
    }

    @Override
    public Optional<ArticleDto> findById(String id) {
        return articleJpaRepository.findById(id)
                .map(ArticleMapper::map);
    }

    @Override
    public Optional<ArticleDto> findBySlug(String slug) {
        return articleJpaRepository.findBySlug(slug).map(ArticleMapper::map);
    }

    @Transactional(readOnly = true)
    @Override
    public List<ArticleDto> getArticlesForUser(ArticleSearchParams params, String email) {
        Optional<UserEntity> optionalUser = userJpaRepository.findByEmail(email);

        if (optionalUser.isEmpty()) {
            throw new UsernameNotFoundException("User with email: [%s] not exist!".formatted(email));
        }

        String userId = optionalUser.get().getId();

        Pageable pageable = PageRequest.of(params.pageNumber(), params.size());
        return articleJpaRepository.findArticlesByUserId(userId, pageable)
                .stream()
                .map(ArticleMapper::map)
                .toList();
    }


    private Specification<ArticleEntity> createArticleSpecification(ArticleSearchParams params) {
        return (root, query, criteriaBuilder) -> {
            Predicate predicate = criteriaBuilder.conjunction();

            if (params.articleName() != null) {
                predicate = criteriaBuilder.and(predicate,
                        criteriaBuilder.like(
                                criteriaBuilder.lower(root.get("title")),
                                "%" + params.articleName().toLowerCase() + "%"
                        )
                );
            }

            if (params.generalSearch() != null) {
                String searchTerm = "%" + params.generalSearch().toLowerCase() + "%";
                Predicate titlePredicate = criteriaBuilder.like(
                        criteriaBuilder.lower(root.get("title")),
                        searchTerm
                );
                Predicate descriptionPredicate = criteriaBuilder.like(
                        criteriaBuilder.lower(root.get("description")),
                        searchTerm
                );
                predicate = criteriaBuilder.and(predicate,
                        criteriaBuilder.or(titlePredicate, descriptionPredicate)
                );
            }

            if (params.dateFrom() != null) {
                try {
                    SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
                    Date fromDate = dateFormat.parse(params.dateFrom());
                    predicate = criteriaBuilder.and(predicate,
                            criteriaBuilder.greaterThanOrEqualTo(root.get("publishedAt"), fromDate)
                    );
                } catch (ParseException e) {
                    log.error("Failed to parse dateFrom: " + params.dateFrom(), e);
                }
            }

            if (params.dateTo() != null) {
                try {
                    SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
                    Date toDate = dateFormat.parse(params.dateTo());
                    Calendar c = Calendar.getInstance();
                    c.setTime(toDate);
                    c.add(Calendar.DATE, 1);
                    Date endDate = c.getTime();

                    predicate = criteriaBuilder.and(predicate,
                            criteriaBuilder.lessThan(root.get("publishedAt"), endDate)
                    );
                } catch (ParseException e) {
                    log.error("Error parsing dateTo: " + params.dateTo(), e);
                }
            }

            if (params.stockName() != null) {
                Join<ArticleEntity, ArticleStockImpactEntity> stockImpactJoin = root.join("articleImpacts", JoinType.INNER);
                predicate = criteriaBuilder.and(predicate,
                        criteriaBuilder.like(
                                criteriaBuilder.lower(stockImpactJoin.get("stockName")),
                                "%" + params.stockName().toLowerCase() + "%"
                        )
                );
            }

            return predicate;
        };
    }
}
