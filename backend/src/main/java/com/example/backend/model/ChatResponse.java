package com.example.backend.model;



import lombok.AllArgsConstructor;
import lombok.Data;

@Data

public class ChatResponse {
    private String message;

    public ChatResponse(String response) {
        this.message = response;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }


}
