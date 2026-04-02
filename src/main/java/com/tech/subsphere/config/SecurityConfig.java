package com.tech.subsphere.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http, OAuth2LoginSuccessHandler oAuth2LoginSuccessHandler) throws Exception {
        http
                // 1. Enable CORS using the bean we created below
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))

                // 2. Disable CSRF so React can send POST requests to our AI endpoint
                .csrf(csrf -> csrf.disable())

                .authorizeHttpRequests(auth -> auth
                        // Secure your AI generation endpoint
                        .requestMatchers("/api/feature/generate").authenticated()
                        // Allow anyone to trigger the login page
                        .anyRequest().permitAll()
                )
                .oauth2Login(oauth2 -> oauth2
                        // 3. USE OUR CUSTOM HANDLER to save the user to the database and THEN bounce them!
                        .successHandler(oAuth2LoginSuccessHandler)
                )
                .logout(logout -> logout
                        .logoutUrl("/logout")
                        .logoutSuccessUrl("http://localhost:5173/")
                        .invalidateHttpSession(true)
                        .clearAuthentication(true)
                        .deleteCookies("JSESSIONID")
                        .permitAll()
                );

        return http.build();
    }

    // --- THE CORS DRAGON SLAYER ---
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        // Explicitly allow the React frontend
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:5173"));

        // Allow all standard HTTP methods
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));

        // Allow all headers
        configuration.setAllowedHeaders(Arrays.asList("*"));

        // VERY IMPORTANT: Allow cookies/session IDs to be sent across ports
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}