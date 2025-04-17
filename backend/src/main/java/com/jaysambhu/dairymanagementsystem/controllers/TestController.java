package com.jaysambhu.dairymanagementsystem.controllers;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/test")
public class TestController {

    @GetMapping("/ping")
    public String ping() {
        return "System is up and running!";
    }
    
    @GetMapping("/status")
    public String checkStatus() {
        return "Authentication system is working properly";
    }
}