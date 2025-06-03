package com.jaysambhu.modulynx.core.module.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TenantModuleDto {
    private Long id;
    private Long tenantId;
    private Long moduleId;
    private boolean enabled;
    private LocalDateTime enabledAt;
    private LocalDateTime disabledAt;
    private ModuleDto module;
}