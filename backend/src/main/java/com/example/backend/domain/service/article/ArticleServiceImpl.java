package com.example.backend.domain.service.article;

import com.example.backend.api.params.ArticleSearchParams;
import com.example.backend.domain.dto.ArticleDto;
import com.example.backend.domain.dto.mapper.ArticleMapper;
import com.example.backend.infrastructure.database.entity.ArticleEntity;
import com.example.backend.infrastructure.database.entity.ArticleStockImpactEntity;
import com.example.backend.infrastructure.database.repository.ArticleJpaRepository;
import jakarta.persistence.criteria.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

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

    @Override
    public List<ArticleDto> findAllBySearchParams(ArticleSearchParams params) {
        Pageable pageable = PageRequest.of(params.getPageNumber(), params.getSize());
        return articleJpaRepository.findAll(createArticleSpecyfication(params), pageable)
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


    private Specification<ArticleEntity> createArticleSpecyfication(ArticleSearchParams params) {
        return (root, query, criteriaBuilder) -> {
            Predicate predicate = criteriaBuilder.conjunction();

            if (params.getArticleName() != null) {
                predicate = criteriaBuilder.and(predicate,
                        criteriaBuilder.like(
                                criteriaBuilder.lower(root.get("title")),
                                "%" + params.getArticleName().toLowerCase() + "%"
                        )
                );
            }

            if (params.getGeneralSearch() != null) {
                String searchTerm = "%" + params.getGeneralSearch().toLowerCase() + "%";
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

            if (params.getDateFrom() != null) {
                try {
                    SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
                    Date fromDate = dateFormat.parse(params.getDateFrom());
                    predicate = criteriaBuilder.and(predicate,
                            criteriaBuilder.greaterThanOrEqualTo(root.get("publishedAt"), fromDate)
                    );
                } catch (ParseException e) {
                    // Handle date parsing exception or log it
                }
            }

            if (params.getDateTo() != null) {
                try {
                    SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
                    Date toDate = dateFormat.parse(params.getDateTo());
                    Calendar c = Calendar.getInstance();
                    c.setTime(toDate);
                    c.add(Calendar.DATE, 1);
                    Date endDate = c.getTime();

                    predicate = criteriaBuilder.and(predicate,
                            criteriaBuilder.lessThan(root.get("publishedAt"), endDate)
                    );
                } catch (ParseException e) {
                    // Handle date parsing exception or log it
                }
            }

            if (params.getStockName() != null) {
                Join<ArticleEntity, ArticleStockImpactEntity> stockImpactJoin = root.join("articleImpacts", JoinType.INNER);
                predicate = criteriaBuilder.and(predicate,
                        criteriaBuilder.like(
                                criteriaBuilder.lower(stockImpactJoin.get("stockName")),
                                "%" + params.getStockName().toLowerCase() + "%"
                        )
                );
            }

            return predicate;
        };
    }
}
