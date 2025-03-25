package com.example.backend.domain.service.article;

import com.example.backend.domain.dto.ArticleDto;
import com.example.backend.domain.dto.mapper.ArticleMapper;
import com.example.backend.infrastructure.database.entity.ArticleEntity;
import com.example.backend.infrastructure.database.repository.ArticleJpaRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class ArticleServiceImpl implements ArticleService {
    private final ArticleJpaRepository articleJpaRepository;

    @Override
    public List<ArticleDto> findAllArticles() {
        return articleJpaRepository.findAll().stream()
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

}
