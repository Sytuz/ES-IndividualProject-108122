package ua.es.iap_api.repositories;

import ua.es.iap_api.entities.CompletionStatus;
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

    Page<Task> findAllByUserEmailAndCompletionStatus(String email, CompletionStatus status, Pageable pageable);
    Page<Task> findAllByUserEmailAndCategoryId(String email, Long categoryId, Pageable pageable);
    Page<Task> findAllByUserEmailAndCategoryIdIsNull(String email, Pageable pageable);
    Page<Task> findAllByUserEmailAndCompletionStatusAndCategoryId(String email, CompletionStatus status, Long categoryId, Pageable pageable);
    Page<Task> findAllByUserEmailAndCompletionStatusAndCategoryIdIsNull(String email, CompletionStatus status, Pageable pageable);
}
