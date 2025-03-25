package com.example.backend.controller;



import com.example.backend.model.ChatRequest;
import com.example.backend.model.ChatResponse;
import com.example.backend.services.HuggingFaceChatService;
import com.example.backend.services.HuggingFaceChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/chat")
@CrossOrigin(origins = "http://localhost:5173") // React frontend URL
public class ChatController {

    @Autowired
    private HuggingFaceChatService huggingFaceChatService;

    @PostMapping
    public ChatResponse processMessage(@RequestBody ChatRequest request) {
        String response = huggingFaceChatService.generateResponse(request.getMessage());
        return new ChatResponse(response);
    }
}
