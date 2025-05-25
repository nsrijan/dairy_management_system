package com.jaysambhu.modulynx.core.tenant.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.jaysambhu.modulynx.core.tenant.model.ModuleType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TenantDto {

    private Long id;

    @NotBlank(message = "Tenant name is required")
    private String name;

    @NotBlank(message = "Tenant slug is required")
    @Pattern(regexp = "^[a-z0-9-]+$", message = "Slug must contain only lowercase letters, numbers, and hyphens")
    private String slug;

    // Field to match frontend naming
    @JsonProperty("subdomain")
    private String subdomain;

    @JsonProperty("active")
    private boolean isActive;

    @NotNull(message = "Module type is required")
    private ModuleType moduleType;

    private LocalDateTime createdAt;
    private String createdBy;
    private LocalDateTime updatedAt;
    private String updatedBy;

    // Helper methods to synchronize slug and subdomain
    public void setSlug(String slug) {
        this.slug = slug;
        this.subdomain = slug; // Keep fields in sync
    }

    public void setSubdomain(String subdomain) {
        this.subdomain = subdomain;
        this.slug = subdomain; // Keep fields in sync
    }
}