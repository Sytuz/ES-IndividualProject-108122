package ua.es.iap_api.repositories;

import ua.es.iap_api.entities.Category;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
    Page<Category> findAllByUserEmail(String userEmail, Pageable pageable);
}
