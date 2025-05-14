package com.jaysambhu.dairymanagementsystem.modules.auth.service;

import com.jaysambhu.dairymanagementsystem.modules.user.dto.AuthResponse;
import com.jaysambhu.dairymanagementsystem.modules.user.dto.LoginRequest;
import com.jaysambhu.dairymanagementsystem.modules.user.dto.RegistrationRequest;
import com.jaysambhu.dairymanagementsystem.modules.user.dto.UserDto;

/**
 * Service interface for authentication operations
 */
public interface AuthService {

    /**
     * Authenticate a user and generate an access token
     *
     * @param loginRequest The login request containing credentials
     * @return Authentication response with token and user details
     */
    AuthResponse login(LoginRequest loginRequest);

    /**
     * Register a new user
     *
     * @param registrationRequest The registration request containing user details
     * @return The created user
     */
    UserDto register(RegistrationRequest registrationRequest);

    /**
     * Logout a user by invalidating their token
     *
     * @param token The JWT token to invalidate
     */
    void logout(String token);

    /**
     * Validate a JWT token
     *
     * @param token The JWT token to validate
     * @return True if the token is valid, false otherwise
     */
    boolean validateToken(String token);
}