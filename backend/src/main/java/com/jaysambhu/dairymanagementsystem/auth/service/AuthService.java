package com.jaysambhu.dairymanagementsystem.auth.service;

import com.jaysambhu.dairymanagementsystem.auth.dto.AuthResponse;
import com.jaysambhu.dairymanagementsystem.auth.dto.LoginRequest;
import com.jaysambhu.dairymanagementsystem.auth.dto.RegisterRequest;

public interface AuthService {
    AuthResponse register(RegisterRequest request);
    AuthResponse login(LoginRequest request);
} 