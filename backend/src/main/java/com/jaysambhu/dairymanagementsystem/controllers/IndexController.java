package com.jaysambhu.dairymanagementsystem.controllers;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class IndexController {

    @GetMapping("/")
    public String index() {
        return "Welcome to Dairy Management System API. Use /api/v1/auth endpoints for authentication.";
    }
} 