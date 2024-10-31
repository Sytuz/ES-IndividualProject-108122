package ua.es.iap_api.services;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import ua.es.iap_api.repositories.TaskRepository;
import ua.es.iap_api.entities.Task;

@Service
public class TaskService {

    private int minTitleLength = 3;
    private int maxTitleLength = 50;
    private int maxDescriptionLength = 255;

    private final TaskRepository taskRepository;

    public TaskService(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    public Page<Task> findAll(Pageable pageable) {
        return taskRepository.findAll(pageable);
    }

    public Page<Task> findAllByCategoryId(Long categoryId, Pageable pageable) {
        return taskRepository.findAllByCategoryId(categoryId, pageable);
    }

    public Page<Task> findAllByUserEmail(String email, Pageable pageable) {
        return taskRepository.findAllByUserEmail(email, pageable);
    }

    public void deleteById(Long id) {
        taskRepository.deleteById(id);
    }

    public void deleteByCategoryId(Long categoryId) {
        taskRepository.deleteByCategoryId(categoryId);
    }

    public boolean taskExistsById(Long id) {
        return taskRepository.existsById(id);
    }

    public boolean isTaskValid(Task task) {
        return (task.getTitle() == null || (task.getTitle().length() >= minTitleLength &&
            task.getTitle().length() <= maxTitleLength)) &&
            (task.getDescription() == null || task.getDescription().length() <= maxDescriptionLength);
    }

    public Task save(Task task) {
        if (!isTaskValid(task)) {
            return null;
        }
        return taskRepository.save(task);
    }

    public Task findById(Long id) {
        return taskRepository.findById(id).orElse(null);
    }

    public void updateCategoryToNullByCategoryId(Long categoryId) {
        taskRepository.findAllByCategoryId(categoryId, Pageable.unpaged()).forEach(task -> {
            task.setCategory(null);
            taskRepository.save(task);
        });
    }
}

