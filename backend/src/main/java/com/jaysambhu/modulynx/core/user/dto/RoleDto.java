package com.jaysambhu.modulynx.core.user.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.jaysambhu.modulynx.core.user.model.RoleName;
import com.jaysambhu.modulynx.core.user.model.RoleType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

/**
 * DTO for transferring Role data to and from the API.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class RoleDto {

    private Long id;

    private RoleName name;

    private String description;

    private RoleType roleType;

    private Set<PermissionDto> permissions;
}