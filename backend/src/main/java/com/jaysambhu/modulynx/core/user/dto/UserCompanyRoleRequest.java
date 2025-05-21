package com.jaysambhu.modulynx.core.user.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for creating or updating user company role assignments.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserCompanyRoleRequest {

    @NotNull(message = "User ID is required")
    private Long userId;

    @NotNull(message = "Company ID is required")
    private Long companyId;

    @NotNull(message = "Role ID is required")
    private Long roleId;

    private boolean isActive = true;
}