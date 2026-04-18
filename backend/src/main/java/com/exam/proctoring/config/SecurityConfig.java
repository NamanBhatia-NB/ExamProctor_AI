package com.exam.proctoring.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Value("${app.frontend.url}")
    private String frontendUrl;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            // 1. Enable Global CORS configuration
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            
            // 2. Disable CSRF for REST APIs
            .csrf(csrf -> csrf.disable())
            
            // 3. Configure route access
            .authorizeHttpRequests(auth -> auth
                // ✅ FIX 1: Explicitly allow browser Preflight OPTIONS requests
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll() 
                
                // Let Auth through
                .requestMatchers("/api/auth/**").permitAll() 
                
                // ✅ FIX 2: Explicitly list the root URLs AND the wildcard URLs
                .requestMatchers(
                    "/api/exams", "/api/exams/**", 
                    "/api/sessions", "/api/sessions/**", 
                    "/api/questions", "/api/questions/**"
                ).permitAll() 
                
                .anyRequest().authenticated()
            )
            
            // 4. PREVENT THE 302 REDIRECT BUG
            .formLogin(form -> form.disable())
            .httpBasic(basic -> basic.disable());

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        // Match your exact React frontend URL
        configuration.setAllowedOrigins(List.of(frontendUrl));
        configuration.setAllowedOrigins(List.of("http://localhost:3000"));
        // Allow all standard methods
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
        // Allow all headers
        configuration.setAllowedHeaders(List.of("*"));
        // Allow credentials (cookies, auth headers)
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}