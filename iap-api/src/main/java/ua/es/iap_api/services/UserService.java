package ua.es.iap_api.services;

import ua.es.iap_api.entities.User;
import ua.es.iap_api.entities.Category;
import ua.es.iap_api.repositories.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.util.Optional;

@Service
public class UserService {

    private int minPasswordLength = 8;
    private int maxPasswordLength = 20;
    private int minUsernameLength = 3;
    private int maxUsernameLength = 20;
    private int minEmailLength = 5;
    private int maxEmailLength = 50;

    private UserRepository userRepository;

    private CategoryService categoryService;

    @Autowired
    public UserService(UserRepository userRepository, CategoryService categoryService) {
        this.userRepository = userRepository;
        this.categoryService = categoryService;
    }

    public User createUser(User user) {
        BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        // Create a 'Default' category for the user
        Category defaultCategory = new Category();
        defaultCategory.setTitle("Default");
        defaultCategory.setDescription("Default category");
        defaultCategory.setUser(user);

        User response = userRepository.save(user);
        categoryService.save(defaultCategory);

        return response;
    }

    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public boolean userExistsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    public UserDetails loadUserByEmail(String email) {
        Optional<User> optionalUser = userRepository.findByEmail(email);
        if (!optionalUser.isPresent()) {
            throw new UsernameNotFoundException("User not found");
        }

        User user = optionalUser.get();
        return org.springframework.security.core.userdetails.User.builder()
                .username(user.getEmail())
                .password(user.getPassword())
                .build();
    }

    public void deleteByEmail(String email) {
        userRepository.deleteByEmail(email);
    }

    public boolean isPasswordCorrect(String password, String encodedPassword) {
        BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        return passwordEncoder.matches(password, encodedPassword);
    }

    public boolean isNewUserValid(User user) {
        return user.getUsername().length() >= minUsernameLength && user.getUsername().length() <= maxUsernameLength
                && user.getEmail().length() >= minEmailLength && user.getEmail().length() <= maxEmailLength
                && user.getEmail().matches("^(.+)@(.+)$")
                && user.getPassword().length() >= minPasswordLength && user.getPassword().length() <= maxPasswordLength;
    }    
}
