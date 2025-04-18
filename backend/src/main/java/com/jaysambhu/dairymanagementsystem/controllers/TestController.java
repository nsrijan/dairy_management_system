package com.jaysambhu.dairymanagementsystem.controllers;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/test")
@Tag(name = "Test API", description = "API endpoints for testing server status")
public class TestController {

    @Operation(summary = "Ping server", description = "Check if the server is running")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Server is running")
    })
    @GetMapping("/ping")
    public String ping() {
        return "System is up and running!";
    }
    
    @Operation(summary = "Authentication status", description = "Check if the authentication system is working")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Authentication system is working")
    })
    @GetMapping("/status")
    public String checkStatus() {
        return "Authentication system is working properly";
    }
}