package ua.es.iap_api.services;

import java.util.List;

import ua.es.iap_api.repositories.CategoryRepository;
import ua.es.iap_api.entities.Category;

import org.springframework.stereotype.Service;

@Service
public class CategoryService {
    
    private CategoryRepository categoryRepository;

    private TaskService taskService;

    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    public void deleteById(Long id) {
        categoryRepository.deleteById(id);
    }

    public void delete(Long id, boolean deleteTasks) {
        if (deleteTasks) {
            taskService.deleteByCategoryId(id);
        }
        categoryRepository.deleteById(id);
    }

    public boolean categoryExistsByTitleAndUserId(String title, Long userId) {
        return categoryRepository.findByTitleAndUserId(title, userId).isPresent();
    }

    public boolean categoryExistsById(Long id) {
        return categoryRepository.existsById(id);
    }

    public Category save(Category category) {
        return categoryRepository.save(category);
    }

    public Category findById(Long id) {
        return categoryRepository.findById(id).orElse(null);
    }

    public List<Category> findAll() {
        return categoryRepository.findAll();
    }

    public List<Category> findAllByUserId(Long userID) {
        return categoryRepository.findAllByUserId(userID);
    }
}
