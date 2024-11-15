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
    Page<Task> findAllByUserSub(String userSub, Pageable pageable);
    Page<Task> findAll(Pageable pageable);

    Page<Task> findAllByUserSubAndCompletionStatus(String sub, CompletionStatus status, Pageable pageable);
    Page<Task> findAllByUserSubAndCategoryId(String sub, Long categoryId, Pageable pageable);
    Page<Task> findAllByUserSubAndCategoryIdIsNull(String sub, Pageable pageable);
    Page<Task> findAllByUserSubAndCompletionStatusAndCategoryId(String sub, CompletionStatus status, Long categoryId, Pageable pageable);
    Page<Task> findAllByUserSubAndCompletionStatusAndCategoryIdIsNull(String sub, CompletionStatus status, Pageable pageable);
}
