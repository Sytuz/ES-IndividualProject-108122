package ua.es.iap_api.controllers;

import ua.es.iap_api.services.JwtService;
import ua.es.iap_api.services.TaskService;
import ua.es.iap_api.entities.Task;

import io.swagger.v3.oas.annotations.tags.Tag;

import org.springframework.http.ResponseEntity;
import org.springframework.data.domain.Page;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.RestController;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@RestController
@RequestMapping("/api/tasks")
@Tag(name = "Tasks Controller", description = "API for managing tasks, requires authentication")
public class TaskController {

    private final TaskService taskService;
    private final JwtService jwtService;

    private final Logger logger = LoggerFactory.getLogger(TaskController.class);

    @Autowired
    public TaskController(TaskService taskService, JwtService jwtService) {
        this.taskService = taskService;
        this.jwtService = jwtService;
    }

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Page<Task>> getTasksByUserEmail(
            @AuthenticationPrincipal UserDetails userDetails,
            Pageable pageable) {
        
        logger.info("Attempting to retrieve tasks for user: {}", userDetails.getUsername());

        String userEmail = userDetails.getUsername(); // Extract email from token subject
        Page<Task> tasks = taskService.findAllByUserEmail(userEmail, pageable);
        return ResponseEntity.ok(tasks);
    }
}