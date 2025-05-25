package com.jaysambhu.modulynx.core.user.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for transferring UserCompanyRole data to and from the API.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class UserCompanyRoleDto {

    private Long id;

    private Long userId;

    private Long companyId;

    private String companyName;

    private Long roleId;

    private String roleName;

    private String roleDisplayName;

    private boolean isActive;
}