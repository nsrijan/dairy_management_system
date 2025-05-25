package com.jaysambhu.modulynx.core.user.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Set;

/**
 * Response DTO for authentication requests
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class AuthResponse {
    private String accessToken;
    private String tokenType;
    private Long expiresIn;
    private String refreshToken;
    private Long userId;
    private String username;
    private String email;
    private String firstName;
    private String lastName;
    private Long primaryTenantId;
    private String primaryTenantName;
    private List<String> roles;
    private List<String> permissions;
    private Set<Long> companyIds;
}