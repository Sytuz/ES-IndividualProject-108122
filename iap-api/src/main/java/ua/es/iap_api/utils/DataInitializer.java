package ua.es.iap_api.utils;

import org.springframework.stereotype.Component;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;

import ua.es.iap_api.entities.AuthenticationMethod;
import ua.es.iap_api.entities.User;
import ua.es.iap_api.services.UserService;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserService userService;

    @Autowired
    public DataInitializer(UserService userService) {
        this.userService = userService;
    }

    @Override
    public void run(String... args) {
        User user = new User();
        user.setAuthenticationMethod(AuthenticationMethod.CREDENTIALS);
        user.setUsername("test");
        user.setEmail("test@test.com");
        user.setPassword("password");
        userService.createUser(user);
    }
}
