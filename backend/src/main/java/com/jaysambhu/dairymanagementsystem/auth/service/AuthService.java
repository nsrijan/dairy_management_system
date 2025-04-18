package com.jaysambhu.dairymanagementsystem.auth.service;

import com.jaysambhu.dairymanagementsystem.auth.dto.AuthResponse;
import com.jaysambhu.dairymanagementsystem.auth.dto.LoginRequest;
import com.jaysambhu.dairymanagementsystem.auth.dto.LogoutResponse;
import com.jaysambhu.dairymanagementsystem.auth.dto.RegisterRequest;

import org.springframework.http.ResponseEntity;

public interface AuthService {
    AuthResponse register(RegisterRequest request);

    AuthResponse login(LoginRequest request);

    LogoutResponse logout(String token);
}