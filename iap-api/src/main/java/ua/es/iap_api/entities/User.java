package ua.es.iap_api.entities;

import java.time.LocalDateTime;

import jakarta.persistence.*;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "users")
public class User {
    @Id
    @Column(name = "email", unique = true, nullable = false)
    private String email;

    @Column(name = "cognito_sub")
    private String cognitoSub;

    @Column(name = "username")
    private String username;

    @Column(name = "password")
    private String password;

    @Column(name = "authentication_method" , nullable = false)
    @Enumerated(EnumType.STRING)
    private AuthenticationMethod authenticationMethod;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

}
