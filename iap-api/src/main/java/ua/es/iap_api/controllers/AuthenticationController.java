package ua.es.iap_api.controllers;

import ua.es.iap_api.dtos.RegisterDTO;
import ua.es.iap_api.dtos.LoginDTO;
import ua.es.iap_api.entities.AuthenticationMethod;
import ua.es.iap_api.entities.User;
import ua.es.iap_api.services.UserService;
import ua.es.iap_api.services.JwtService;

import org.springframework.security.core.userdetails.UserDetails;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@Tag(name = "Authentication Controller", description = "Public API for managing user authentication")
public class AuthenticationController {

    private final UserService userService;
    private final JwtService jwtService;
    
    private final Logger logger = LoggerFactory.getLogger(AuthenticationController.class);

    @Autowired
    public AuthenticationController(UserService userService, JwtService jwtService) {
        this.userService = userService;
        this.jwtService = jwtService;
    }

    @Operation(summary = "Register a user", description = "Creates a new user in the system")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "User created successfully", content = @Content(mediaType = "application/json", schema = @Schema(implementation = User.class))),
            @ApiResponse(responseCode = "400", description = "Invalid user data"),
            @ApiResponse(responseCode = "409", description = "User already exists")
    })
    @PostMapping("/register")
    public ResponseEntity<User> createUser(@RequestBody RegisterDTO newUser) {
        logger.info("Attempting to create a new user");

        // Create a new user object with the data from the request
        User user = new User();
        user.setUsername(newUser.getUsername());
        user.setEmail(newUser.getEmail());
        user.setPassword(newUser.getPassword());
        user.setAuthenticationMethod(AuthenticationMethod.CREDENTIALS);

        // Check data validity
        if (!userService.isNewUserValid(user)) {
            logger.error("Invalid user");
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        // Check if the user already exists by its email
        if (userService.userExistsByEmail(user.getEmail())) {
            logger.error("User email already exists");
            return new ResponseEntity<>(HttpStatus.CONFLICT);
        }

        userService.createUser(user);
        logger.info("User created successfully");
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @Operation(summary = "Login a user", description = "Logs in a user to the system")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "User login successful", content = @Content(mediaType = "application/json", schema = @Schema(implementation = User.class))),
            @ApiResponse(responseCode = "400", description = "Invalid credentials"),
    })
    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> loginUser(@RequestBody LoginDTO loginData) {
        logger.info("Attempting to login a user");

        String email = loginData.getEmail();
        String password = loginData.getPassword();

        // Check if the user exists by its email
        if (!userService.userExistsByEmail(email)) {
            logger.error("User not found");
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        // Get the user by its email
        UserDetails user = userService.loadUserByEmail(email);

        // Check if the password is correct
        if (!userService.isPasswordCorrect(password, user.getPassword())) {
            logger.error("Invalid password");
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        // Generate a JWT token for the user
        String token = jwtService.generateToken(user);

        // Return the token in the response's body
        Map<String, String> response = new HashMap<>();
        response.put("token", token);

        logger.info("User logged in successfully, JWT token generated");
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}
