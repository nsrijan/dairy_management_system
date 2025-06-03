package com.jaysambhu.modulynx.core.module.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ModuleDto {
    private Long id;
    private String name;
    private String code;
    private String description;
    private boolean active;
    private Set<FeatureDto> features;
}