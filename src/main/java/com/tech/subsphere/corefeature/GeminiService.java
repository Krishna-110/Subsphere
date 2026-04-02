package com.tech.subsphere.corefeature;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class GeminiService {

    @Value("${gemini.api.key}")
    private String apiKey;

    public String generateInterviewQuestions(String resume, String jobDescription) {

        // 1. The Google API URL
        String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" + apiKey;
        // 2. The Secret Prompt (This is the secret sauce of your SaaS)
        String prompt = "Act as an expert technical interviewer at a top tech company. " +
                "I am applying for a job with this description: " + jobDescription + "\n\n" +
                "Here is my current resume: " + resume + "\n\n" +
                "Please give me a harsh, realistic critique of how my resume matches the job description, " +
                "and provide 5 highly technical interview questions I should prepare for.";

        // 3. Building the complex JSON payload that Google expects
        Map<String, Object> requestBody = new HashMap<>();
        Map<String, Object> parts = new HashMap<>();
        parts.put("text", prompt);
        Map<String, Object> contents = new HashMap<>();
        contents.put("parts", Collections.singletonList(parts));
        requestBody.put("contents", Collections.singletonList(contents));

        // 4. Setting up the HTTP "Phone Call" (RestTemplate)
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);

        try {
            // 5. Fire the request over the internet and wait for Google to reply!
            System.out.println("DEBUG: Sending request to Gemini AI...");
            ResponseEntity<Map> response = restTemplate.postForEntity(url, request, Map.class);

            // 6. Extract the actual text from Google's complex JSON response
            Map<String, Object> body = response.getBody();
            List<Map<String, Object>> candidates = (List<Map<String, Object>>) body.get("candidates");
            Map<String, Object> content = (Map<String, Object>) candidates.get(0).get("content");
            List<Map<String, Object>> respParts = (List<Map<String, Object>>) content.get("parts");

            return (String) respParts.get(0).get("text");

        } catch (Exception e) {
            System.out.println("DEBUG: AI Error - " + e.getMessage());
            return "Sorry, our AI engine is currently busy. Please try again later.";
        }
    }
}