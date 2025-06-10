package com.jaysambhu.modulynx.core.tenant.dto;

import com.jaysambhu.modulynx.core.company.dto.CompanyDto;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TenantOnboardingRequest {
    @NotNull
    @Valid
    private TenantDto tenant;

    @NotNull
    @Valid
    private CompanyDto company;

    @NotNull
    @Valid
    private CreateTenantAdminRequest admin;
}