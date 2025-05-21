package com.jaysambhu.dairymanagementsystem.modules.user.dto;

import com.jaysambhu.dairymanagementsystem.modules.user.model.UserType;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for registering a new user within a tenant
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserRegistrationDto {

    @NotBlank(message = "Username is required")
    @Size(min = 3, max = 50, message = "Username must be between 3 and 50 characters")
    private String username;

    @NotBlank(message = "Email is required")
    @Email(message = "Email must be valid")
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must be at least 6 characters")
    private String password;

    @NotBlank(message = "First name is required")
    private String firstName;

    @NotBlank(message = "Last name is required")
    private String lastName;

    private String phone;

    @NotNull(message = "User type is required")
    private UserType userType;

    // Optional - only used when super admin creates a user for a specific tenant
    private Long tenantId;

    // Optional - companIds for which the user should have access
    private Long[] companyIds;

    // Optional - roleIds to assign to the user for each company
    private Long[] roleIds;
}