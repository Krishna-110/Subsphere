package com.tech.subsphere.corefeature;

import com.tech.subsphere.user.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/feature")
@RequiredArgsConstructor
public class FeatureController {

    private final UserService userService;
    private final GeminiService geminiService;
    private final PdfService pdfService;

    @PostMapping("/extract-pdf")
    public String extractPdfText(@RequestParam("file") MultipartFile file) {
        try {
            return pdfService.extractTextFromPdf(file);
        } catch (Exception e) {
            return "❌ Error parsing PDF: " + e.getMessage();
        }
    }

    // Changed from @GetMapping to @PostMapping because we are SENDING large text data
    @PostMapping("/generate")
    public String useSaaSFeature(
            @AuthenticationPrincipal Object principal,
            @RequestBody InterviewRequest payload) { // Catch the JSON body from the user

        String email;
        if (principal instanceof OAuth2User oauth2User) {
            email = oauth2User.getAttribute("email");
        } else if (principal instanceof String s) {
            email = s;
        } else {
            return "❌ ERROR: Authentication sequence failed.";
        }

        // 1. Check if they have credits
        boolean isAllowed = userService.attemptToUseFeature(email);

        // 2. If allowed, call the AI!
        if (isAllowed) {
            return geminiService.generateInterviewQuestions(payload.getResume(), payload.getJobDescription());
        } else {
            return "❌ ERROR: You have reached your FREE plan limit! Please upgrade to PRO in the Nexus tab to continue.";
        }
    }
}