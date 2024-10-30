package ua.es.iap_api.controllers;

import ua.es.iap_api.services.CategoryService;
import ua.es.iap_api.entities.Category;

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

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
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
}