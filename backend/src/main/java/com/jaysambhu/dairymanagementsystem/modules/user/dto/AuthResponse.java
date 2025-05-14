package com.jaysambhu.dairymanagementsystem.modules.user.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * DTO for authentication responses.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class AuthResponse {

    private String accessToken;

    private String tokenType;

    private Long expiresIn;

    private String refreshToken;

    private Long userId;

    private String username;

    private String email;

    private Long primaryTenantId;

    private String primaryTenantName;

    private List<String> roles;
}