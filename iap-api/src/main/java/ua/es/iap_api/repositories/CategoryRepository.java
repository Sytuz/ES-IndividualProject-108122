package ua.es.iap_api.repositories;

import ua.es.iap_api.entities.Category;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
    Optional<Category> findByTitleAndUserId(String title, Long userId);
    List<Category> findAllByUserId(Long userId);
}
