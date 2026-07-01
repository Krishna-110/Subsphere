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
    public SecurityFilterChain filterChain(HttpSecurity http, OAuth2LoginSuccessHandler oAuth2LoginSuccessHandler,
            JwtAuthenticationFilter jwtAuthFilter) throws Exception {
        http
                // 1. Enable CORS using the bean we created below
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))

                // 2. Disable CSRF so React can send POST requests to our AI endpoint
                .csrf(csrf -> csrf.disable())

                // 3. Make App Stateless (NO SESSIONS)
                .sessionManagement(session -> session.sessionCreationPolicy(
                        org.springframework.security.config.http.SessionCreationPolicy.STATELESS))

                .authorizeHttpRequests(auth -> auth
                        // Secure your AI generation endpoint
                        .requestMatchers("/api/feature/generate").authenticated()
                        // Allow anyone to trigger the login page
                        .anyRequest().permitAll())
                .oauth2Login(oauth2 -> oauth2
                        // 4. USE OUR CUSTOM HANDLER to save the user to the database and THEN bounce
                        // them!
                        .successHandler(oAuth2LoginSuccessHandler))
                .logout(logout -> logout
                        .logoutUrl("/logout")
                        .logoutSuccessUrl("http://localhost:5173/")
                        .permitAll())
                // 5. Add JWT Filter before typical auth filter
                .addFilterBefore(jwtAuthFilter,
                        org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    // --- THE CORS DRAGON SLAYER ---
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        // Allow React Web, Expo Web, and Mobile device connections (including nip.io
        // variants for Google OAuth)
        configuration.setAllowedOrigins(Arrays.asList(
                "http://localhost:5173",
                "http://192.168.29.245:8081",
                "http://192.168.29.245.nip.io:8081",
                "http://192.168.29.245:19000"));

        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}