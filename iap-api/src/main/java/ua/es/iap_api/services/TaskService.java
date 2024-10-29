package ua.es.iap_api.services;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import ua.es.iap_api.repositories.TaskRepository;
import ua.es.iap_api.entities.Task;

@Service
public class TaskService {

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

    public Task save(Task task) {
        return taskRepository.save(task);
    }

    public Task findById(Long id) {
        return taskRepository.findById(id).orElse(null);
    }
}

