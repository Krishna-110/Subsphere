package com.tech.subsphere.user;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.CrossOrigin;

@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")

@RestController
@RequestMapping
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/health") // This listens specifically for GET requests at /api/users/health
    public String healthCheck() {
        return "Subsphere User API is up and running smoothly!";
    }

    @GetMapping("/api/users/me")
    public ResponseEntity<?> getCurrentUser(@AuthenticationPrincipal Object principal) {
        String email;
        if (principal instanceof OAuth2User oauth2User) {
            email = oauth2User.getAttribute("email");
        } else if (principal instanceof String s) {
            email = s;
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Not authenticated");
        }

        User user = userService.getUserByEmail(email);
        return ResponseEntity.ok(user);
    }

}
