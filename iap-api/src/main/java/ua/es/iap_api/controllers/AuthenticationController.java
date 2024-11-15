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
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@Tag(name = "Authentication Controller", description = "Public API for managing user authentication")
public class AuthenticationController {

    private final UserService userService;
    private final JwtService jwtService;

    @Value("${spring.security.oauth2.client.registration.cognito.clientId}")
    private String clientId; // Your Cognito app client ID

    @Value("${spring.security.oauth2.client.registration.cognito.clientSecret}")
    private String clientSecret; // Your Cognito app client secret

    @Value("${spring.security.oauth2.client.registration.cognito.redirect-uri}")
    private String redirectUri; // The redirect URI you configured in Cognito

    @Value("${spring.security.oauth2.client.provider.cognito.tokenEndpoint}")
    private String tokenEndpoint; // The Cognito token endpoint

    private final RestTemplate restTemplate;

    private final Logger logger = LoggerFactory.getLogger(AuthenticationController.class);

    @Autowired
    public AuthenticationController(UserService userService, JwtService jwtService, RestTemplate restTemplate) {
        this.userService = userService;
        this.jwtService = jwtService;
        this.restTemplate = restTemplate;
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
    @PostMapping("/login_deprecated")
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
    
    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> exchangeCodeForTokens(@RequestBody Map<String, String> requestBody) {
        String code = requestBody.get("code");
    
        if (code == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Code is required"));
        }
    
        // Prepare the request body for exchanging the code for tokens using MultiValueMap
        MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
        body.add("grant_type", "authorization_code");
        body.add("code", code);
        body.add("redirect_uri", redirectUri);
        body.add("client_id", clientId);
        body.add("client_secret", clientSecret);
    
        // Create the headers (Cognito expects application/x-www-form-urlencoded content type)
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
    
        // Build the form-encoded data
        UriComponentsBuilder uriBuilder = UriComponentsBuilder.fromHttpUrl(tokenEndpoint);
        HttpEntity<MultiValueMap<String, String>> requestEntity = new HttpEntity<>(body, headers);
    
        try {
            // Make the POST request to exchange the code for tokens
            ResponseEntity<Map> response = restTemplate.exchange(
                    uriBuilder.toUriString(),
                    HttpMethod.POST,
                    requestEntity,
                    Map.class
            );
    
            // Extract tokens from the response body
            Map<String, String> responseBody = response.getBody();
            if (responseBody != null) {
                String idToken = responseBody.get("id_token");
    
                // Return the tokens in the response
                Map<String, String> tokens = new HashMap<>();
                tokens.put("idToken", idToken);

                // Add CORS headers to the response
                HttpHeaders responseHeaders = new HttpHeaders();
                responseHeaders.add("Access-Control-Allow-Origin", "*"); // Allow the frontend to access the response
                responseHeaders.add("Access-Control-Allow-Credentials", "true"); // Allow cookies and credentials in cross-origin requests
    
                return ResponseEntity.ok(tokens);
            } else {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", "Failed to retrieve tokens"));
            }
    
        } catch (Exception e) {
            // Handle any errors during the exchange
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", e.getMessage()));
        }
    }
}