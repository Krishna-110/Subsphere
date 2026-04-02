package com.tech.subsphere.corefeature;

import com.tech.subsphere.user.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/feature")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class FeatureController {

    private final UserService userService;
    private final GeminiService geminiService; // Inject our new AI Chef!

    // Changed from @GetMapping to @PostMapping because we are SENDING large text data
    @PostMapping("/generate")
    public String useSaaSFeature(
            @AuthenticationPrincipal OAuth2User principal,
            @RequestBody InterviewRequest payload) { // Catch the JSON body from the user

        String email = principal.getAttribute("email");

        // 1. Check if they have credits
        boolean isAllowed = userService.attemptToUseFeature(email);

        // 2. If allowed, call the AI!
        if (isAllowed) {
            return geminiService.generateInterviewQuestions(payload.getResume(), payload.getJobDescription());
        } else {
            return "❌ ERROR: You have reached your FREE plan limit! Please upgrade to PRO at /api/payment/checkout to continue.";
        }
    }
}