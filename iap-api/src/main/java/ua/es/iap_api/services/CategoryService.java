package ua.es.iap_api.services;

import java.util.List;

import ua.es.iap_api.repositories.CategoryRepository;
import ua.es.iap_api.entities.Category;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CategoryService {

    private int minTitleLength = 3;
    private int maxTitleLength = 50;
    private int maxDescriptionLength = 255;
    
    private CategoryRepository categoryRepository;

    private TaskService taskService;

    public CategoryService(CategoryRepository categoryRepository, TaskService taskService) {
        this.categoryRepository = categoryRepository;
        this.taskService = taskService;
    }

    public void deleteById(Long id) {
        categoryRepository.deleteById(id);
    }

    @Transactional
    public void delete(Long id, boolean deleteTasks) {
        if (deleteTasks) {
            taskService.deleteByCategoryId(id);
        }
        else {
            taskService.updateCategoryToNullByCategoryId(id);
        }
        categoryRepository.deleteById(id);
    }

    public boolean categoryExistsById(Long id) {
        return categoryRepository.existsById(id);
    }

    public boolean isCategoryValid(Category category) {
        return (category.getTitle() == null || (category.getTitle().length() >= minTitleLength &&
            category.getTitle().length() <= maxTitleLength)) &&
            (category.getDescription() == null || category.getDescription().length() <= maxDescriptionLength);
    }

    public Category save(Category category) {
        if (!isCategoryValid(category)) {
            return null;
        }
        return categoryRepository.save(category);
    }

    public Category findById(Long id) {
        return categoryRepository.findById(id).orElse(null);
    }

    public List<Category> findAll() {
        return categoryRepository.findAll();
    }

    public Page<Category> findAllByUserEmail(String email, Pageable pageable) {
        return categoryRepository.findAllByUserEmail(email, pageable);
    }
}
