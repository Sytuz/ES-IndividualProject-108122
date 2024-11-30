package ua.es.iap_api.repositories;

import ua.es.iap_api.entities.CompletionStatus;
import ua.es.iap_api.entities.Task;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
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

    Page<Task> findAllByUserSubAndCompletionStatusAndCategoryId(String sub, CompletionStatus status, Long categoryId,
            Pageable pageable);

    Page<Task> findAllByUserSubAndCompletionStatusAndCategoryIdIsNull(String sub, CompletionStatus status,
            Pageable pageable);

    @Query("SELECT t FROM Task t WHERE t.userSub = :userSub " +
            "AND (:status IS NULL OR t.completionStatus = :status) " +
            "AND (:categoryId IS NULL OR :categoryId = -1 AND t.category.id IS NULL OR :categoryId <> -1 AND t.category.id = :categoryId) " +            "ORDER BY " +
            "CASE t.completionStatus " +
            "WHEN 'COMPLETED' THEN 1 " +
            "WHEN 'ONGOING' THEN 2 " +
            "WHEN 'IDLE' THEN 3 " +
            "ELSE 4 END, " + // Fallback for any other values
            "t.id ASC") // Additional sorting to stabilize the order
    Page<Task> findAllByUserSubWithCustomSort(
            @Param("userSub") String userSub,
            @Param("status") CompletionStatus status,
            @Param("categoryId") Long categoryId,
            Pageable pageable);

}
