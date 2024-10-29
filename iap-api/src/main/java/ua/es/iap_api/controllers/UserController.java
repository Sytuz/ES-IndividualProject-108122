package ua.es.iap_api.controllers;

import ua.es.iap_api.services.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.RestController;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@RestController
@RequestMapping("/api/users")
@Tag(name = "Users Controller", description = "API for managing users, requires authentication")
public class UserController {

    private final UserService userService;

    private final Logger logger = LoggerFactory.getLogger(UserController.class);

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @Operation(summary = "Get user username", description = "Retrieves the authenticated user's username")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successful retrieval", content = @Content(mediaType = "application/json", schema = @Schema(implementation = String.class))),
            @ApiResponse(responseCode = "403", description = "Invalid token or user not found"),
    })
    @GetMapping("/username")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<String> getUsername(
            @AuthenticationPrincipal UserDetails userDetails) {
        
        logger.info("Attempting to retrieve username for user: {}", userDetails.getUsername());

        String userEmail = userDetails.getUsername(); // Extract email from token subject
        String username = userService.getUsernameByEmail(userEmail);
        return ResponseEntity.ok(username);
    }
}