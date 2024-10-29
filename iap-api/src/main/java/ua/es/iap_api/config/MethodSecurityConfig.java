package ua.es.iap_api.config;

import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.context.annotation.Configuration;

@Configuration
@EnableMethodSecurity(prePostEnabled = true)
public class MethodSecurityConfig {
}

