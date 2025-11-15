package com.example.demo.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.Map;

@RestController
public class UserController {

    @GetMapping("/api/user")
    public Map<String, Object> getUser() {
        return Map.of(
            "id", 1,
            "name", "Nguyen Van A",
            "email", "a@example.com"
        );
    }
}
