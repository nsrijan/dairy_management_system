package com.jaysambhu.modulynx.modules.dairy.milkcollection.dto;

import lombok.Data;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Data
public class CreateMcbRequest {

    @NotBlank(message = "Name is required")
    private String name;

    @NotBlank(message = "Code is required")
    private String code;

    private String address;
    private String phone;
    private String contactNumber;
    private Integer capacityLiters;
    private Integer chillVatCount;
    private Long managerId;

    @NotNull(message = "Active status is required")
    private Boolean isActive = true;
}