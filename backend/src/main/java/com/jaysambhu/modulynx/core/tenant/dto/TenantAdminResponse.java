package com.jaysambhu.modulynx.core.tenant.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for tenant admin response
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TenantAdminResponse {
    private Long id;
    private String email;
    private String username;
    private String firstName;
    private String lastName;
    private boolean isActive;
    private String createdAt;
    private String updatedAt;
}