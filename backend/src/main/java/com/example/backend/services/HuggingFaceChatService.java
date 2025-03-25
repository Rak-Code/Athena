package com.example.backend.services;





import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class HuggingFaceChatService {
    @Value("${huggingface.api.key}")
    private String apiKey;

    private static final String API_URL = "https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium";

    public String generateResponse(String userMessage) {
        RestTemplate restTemplate = new RestTemplate();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Authorization", "Bearer " + apiKey);

        Map<String, String> requestBody = new HashMap<>();
        requestBody.put("inputs", userMessage);

        HttpEntity<Map<String, String>> request = new HttpEntity<>(requestBody, headers);

        try {
            List response = restTemplate.postForObject(API_URL, request, List.class);

            if (response != null && !response.isEmpty()) {
                Map<String, String> responseMap = (Map<String, String>) response.get(0);
                return responseMap.get("generated_text");
            }
            return "I couldn't generate a response.";
        } catch (Exception e) {
            return "Error processing your request: " + e.getMessage();
        }
    }
}