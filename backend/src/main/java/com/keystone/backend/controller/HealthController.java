package com.keystone.backend.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HealthController {

    @GetMapping("/")
    public String home() {
        return "Keystone Backend is running successfully!";
    }

    @GetMapping("/health")
    public String health() {
        return "OK";
    }
}