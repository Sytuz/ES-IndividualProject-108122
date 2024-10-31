package ua.es.iap_api.controllers;

import ua.es.iap_api.services.CategoryService;
import ua.es.iap_api.dtos.CategoryDelDTO;
import ua.es.iap_api.entities.Category;
import ua.es.iap_api.entities.Task;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

import org.springframework.http.ResponseEntity;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestBody;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/api/categories")
@Tag(name = "Categories Controller", description = "API for managing categories, requires authentication")
public class CategoryController {

    private final CategoryService categoryService;

    private final Logger logger = LoggerFactory.getLogger(CategoryController.class);

    @Autowired
    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @Operation(summary = "Get user categories", description = "Retrieves all categories for the authenticated user")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successful retrieval", content = @Content(mediaType = "application/json", schema = @Schema(implementation = Category.class))),
            @ApiResponse(responseCode = "403", description = "Invalid token or user not found"),
    })
    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Page<Category>> getCategories(
            @AuthenticationPrincipal UserDetails userDetails,
            Pageable pageable) {
        
        logger.info("Attempting to retrieve categories for user: {}", userDetails.getUsername());

        String userEmail = userDetails.getUsername(); // Extract email from token subject
        Page<Category> categories = categoryService.findAllByUserEmail(userEmail, pageable);
        return ResponseEntity.ok(categories);
    }

    @Operation(summary = "Create a user category", description = "Creates a category for the authenticated user")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Successful creation", content = @Content(mediaType = "application/json", schema = @Schema(implementation = Task.class))),
            @ApiResponse(responseCode = "400", description = "Invalid category data"),
            @ApiResponse(responseCode = "403", description = "Invalid token or user not found"),
    })
    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Category> createCategory(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody Category category) {
        
        logger.info("Attempting to create a new category for user: {}", userDetails.getUsername());

        String userEmail = userDetails.getUsername(); // Extract email from token subject
        category.setUserEmail(userEmail);
        Category newCategory = categoryService.save(category);
        
        if (newCategory == null) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(newCategory);
    }

    
    @Operation(summary = "Delete a user category", description = "Deletes a category for the authenticated user")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Successful deletion"),
            @ApiResponse(responseCode = "400", description = "Invalid category data"),
            @ApiResponse(responseCode = "403", description = "Invalid token or user not found"),
    })
    @DeleteMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> deleteCategory(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody CategoryDelDTO categoryDelDTO) {
        
        logger.info("Attempting to delete category for user: {}", userDetails.getUsername());

        String userEmail = userDetails.getUsername(); // Extract email from token subject
        Category category = categoryService.findById(categoryDelDTO.getId());
        if (category == null || !category.getUserEmail().equals(userEmail)) {
            return ResponseEntity.badRequest().build();
        }

        categoryService.delete(categoryDelDTO.getId(), categoryDelDTO.isDeleteTasks());
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Edit a user category", description = "Edits a category for the authenticated user")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successful edit", content = @Content(mediaType = "application/json", schema = @Schema(implementation = Task.class))),
            @ApiResponse(responseCode = "400", description = "Invalid category data"),
            @ApiResponse(responseCode = "403", description = "Invalid token or user not found"),
    })
    @PutMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Category> editCategory(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody Category category) {
        
        logger.info("Attempting to edit category for user: {}", userDetails.getUsername());

        String userEmail = userDetails.getUsername(); // Extract email from token subject
        if (category.getId() == null) {
            return ResponseEntity.badRequest().build();
        }
        
        Category oldCategory = categoryService.findById(category.getId());
        if (oldCategory == null || !oldCategory.getUserEmail().equals(userEmail)) {
            return ResponseEntity.badRequest().build();
        }
        category.setUserEmail(userEmail);
        Category editedCategory = categoryService.save(category);
        return ResponseEntity.ok(editedCategory);
    }
}