package ua.es.iap_api.repositories;

import ua.es.iap_api.entities.Task;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    void deleteByCategoryId(Long categoryId);
    Page<Task> findAllByCategoryId(Long categoryId, Pageable pageable);
    Page<Task> findAllByUserEmail(String userEmail, Pageable pageable);
    Page<Task> findAll(Pageable pageable);
}
