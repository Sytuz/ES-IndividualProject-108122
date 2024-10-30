package ua.es.iap_api.controllers;

import ua.es.iap_api.services.TaskService;
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

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestBody;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/api/tasks")
@Tag(name = "Tasks Controller", description = "API for managing tasks, requires authentication")
public class TaskController {

    private final TaskService taskService;

    private final Logger logger = LoggerFactory.getLogger(TaskController.class);

    @Autowired
    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    @Operation(summary = "Get user tasks", description = "Retrieves all tasks for the authenticated user")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successful retrieval", content = @Content(mediaType = "application/json", schema = @Schema(implementation = Task.class))),
            @ApiResponse(responseCode = "403", description = "Invalid token or user not found"),
    })
    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Page<Task>> getTasks(
            @AuthenticationPrincipal UserDetails userDetails,
            Pageable pageable) {
        
        logger.info("Attempting to retrieve tasks for user: {}", userDetails.getUsername());

        String userEmail = userDetails.getUsername(); // Extract email from token subject
        Page<Task> tasks = taskService.findAllByUserEmail(userEmail, pageable);
        return ResponseEntity.ok(tasks);
    }

    @Operation(summary = "Create a user task", description = "Creates a task for the authenticated user")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Successful creation", content = @Content(mediaType = "application/json", schema = @Schema(implementation = Task.class))),
            @ApiResponse(responseCode = "400", description = "Invalid task data"),
            @ApiResponse(responseCode = "403", description = "Invalid token or user not found"),
    })
    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Task> createTask(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody Task task) {
        
        logger.info("Attempting to create a new task for user: {}", userDetails.getUsername());

        String userEmail = userDetails.getUsername(); // Extract email from token subject
        task.setUserEmail(userEmail);
        Task newTask = taskService.save(task);
        
        if (newTask == null) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(newTask);
    }
}