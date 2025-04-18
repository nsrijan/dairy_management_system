package com.jaysambhu.dairymanagementsystem.controllers;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Tag(name = "Home", description = "Index page API")
public class IndexController {

    @Operation(summary = "Welcome message", description = "Returns the welcome message for the API")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Successfully retrieved welcome message")
    })
    @GetMapping("/")
    public String index() {
        return "Welcome to Dairy Management System API. Use /api/v1/auth endpoints for authentication.";
    }
} 