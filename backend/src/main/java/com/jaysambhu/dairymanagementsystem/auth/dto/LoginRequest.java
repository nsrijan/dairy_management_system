package com.jaysambhu.dairymanagementsystem.auth.dto;

import lombok.Data;

@Data
public class LoginRequest {
    // This can be either email or username
    private String usernameOrEmail;
    private String password;
    
    // For backward compatibility with code expecting username
    public String getUsername() {
        return usernameOrEmail;
    }
}