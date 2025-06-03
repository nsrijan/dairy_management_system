package com.jaysambhu.modulynx.core.module.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FeatureDto {
    private Long id;
    private String name;
    private String code;
    private String description;
    private boolean active;
    private Long moduleId;
}