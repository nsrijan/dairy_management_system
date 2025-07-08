package com.jaysambhu.modulynx.core.company.controller;

import com.jaysambhu.modulynx.common.response.GlobalApiResponse;
import com.jaysambhu.modulynx.context.CompanyContext;
import com.jaysambhu.modulynx.core.company.dto.CompanyDto;
import com.jaysambhu.modulynx.core.company.service.CompanyService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

/**
 * Controller for company-specific operations.
 * Handles operations that are scoped to a specific company and require
 * company-level access control.
 * 
 * Following Single Responsibility Principle - only handles company-specific
 * operations.
 * URL Pattern: /api/v1/companies/{companyId}/...
 * 
 * Security: All endpoints are protected by CompanyContextFilter which
 * validates:
 * - User has access to the requested company (via JWT claims)
 * - Sets CompanyContext for use in service layer
 */
@RestController
@RequestMapping("/api/v1/companies")
@RequiredArgsConstructor
@Slf4j
public class CompanyOperationsController {

    private final CompanyService companyService;

    /**
     * Get company-specific data
     * URL: GET /api/v1/companies/{companyId}/data
     * 
     * CompanyContextFilter automatically validates access and sets CompanyContext
     */
    @GetMapping("/{companyId}/data")
    public ResponseEntity<GlobalApiResponse<CompanyDto>> getCompanyData(@PathVariable Long companyId) {
        log.debug("Getting company data for company ID: {} (CompanyContext: {})", companyId, CompanyContext.get());

        CompanyDto companyData = companyService.getCurrentCompanyData();

        return ResponseEntity.ok(GlobalApiResponse.<CompanyDto>builder()
                .success(true)
                .message("Company data retrieved successfully")
                .data(companyData)
                .build());
    }

    /**
     * Create company-specific resource
     * URL: POST /api/v1/companies/{companyId}/resources
     */
    @PostMapping("/{companyId}/resources")
    public ResponseEntity<GlobalApiResponse<Object>> createCompanyResource(
            @PathVariable Long companyId,
            @RequestBody Map<String, Object> resourceData) {

        log.debug("Creating resource for company ID: {} (CompanyContext: {})", companyId, CompanyContext.get());

        Object createdResource = companyService.createCompanyResource(resourceData);

        return ResponseEntity.ok(GlobalApiResponse.<Object>builder()
                .success(true)
                .message("Company resource created successfully")
                .data(createdResource)
                .build());
    }

    /**
     * Get company-specific metrics
     * URL: GET /api/v1/companies/{companyId}/metrics
     */
    @GetMapping("/{companyId}/metrics")
    public ResponseEntity<GlobalApiResponse<Object>> getCompanyMetrics(@PathVariable Long companyId) {
        log.debug("Getting metrics for company ID: {} (CompanyContext: {})", companyId, CompanyContext.get());

        Object metrics = companyService.getCompanyMetrics();

        return ResponseEntity.ok(GlobalApiResponse.<Object>builder()
                .success(true)
                .message("Company metrics retrieved successfully")
                .data(metrics)
                .build());
    }

    /**
     * Example of using CompanyContext directly in controller
     * URL: GET /api/v1/companies/{companyId}/context-info
     */
    @GetMapping("/{companyId}/context-info")
    public ResponseEntity<GlobalApiResponse<Map<String, Object>>> getContextInfo(@PathVariable Long companyId) {
        log.debug("Getting context info for company ID: {}", companyId);

        Map<String, Object> contextInfo = new HashMap<>();
        contextInfo.put("pathCompanyId", companyId);
        contextInfo.put("contextCompanyId", CompanyContext.get());
        contextInfo.put("contextSet", CompanyContext.isSet());

        return ResponseEntity.ok(GlobalApiResponse.<Map<String, Object>>builder()
                .success(true)
                .message("Context information retrieved successfully")
                .data(contextInfo)
                .build());
    }

    /**
     * Example of company-specific business operation
     * URL: PUT /api/v1/companies/{companyId}/settings
     */
    @PutMapping("/{companyId}/settings")
    public ResponseEntity<GlobalApiResponse<Object>> updateCompanySettings(
            @PathVariable Long companyId,
            @RequestBody Map<String, Object> settings) {

        log.debug("Updating settings for company ID: {} (CompanyContext: {})", companyId, CompanyContext.get());

        Long currentCompanyId = CompanyContext.get();

        Map<String, Object> updatedSettings = new HashMap<>();
        updatedSettings.put("companyId", currentCompanyId);
        updatedSettings.put("settings", settings);
        updatedSettings.put("updatedAt", System.currentTimeMillis());

        return ResponseEntity.ok(GlobalApiResponse.<Object>builder()
                .success(true)
                .message("Company settings updated successfully")
                .data(updatedSettings)
                .build());
    }
}