package com.jaysambhu.modulynx.core.company.controller;

import com.jaysambhu.modulynx.common.response.GlobalApiResponse;
import com.jaysambhu.modulynx.core.company.dto.CompanyDto;
import com.jaysambhu.modulynx.core.company.dto.CompanyWithAdminCountDto;
import com.jaysambhu.modulynx.core.company.service.CompanyService;
import com.jaysambhu.modulynx.core.user.dto.UserDto;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/companies")
@RequiredArgsConstructor
public class CompanyController {

    private final CompanyService companyService;

    @GetMapping
    public ResponseEntity<GlobalApiResponse<List<CompanyDto>>> getAllCompanies() {
        List<CompanyDto> companies = companyService.getCompaniesByTenant();
        return ResponseEntity.ok(GlobalApiResponse.<List<CompanyDto>>builder()
                .success(true)
                .message("Companies retrieved successfully")
                .data(companies)
                .build());
    }

    @GetMapping("/pageable")
    public ResponseEntity<GlobalApiResponse<Page<CompanyDto>>> getAllCompaniesPaginated(
            @PageableDefault(size = 10) Pageable pageable) {
        Page<CompanyDto> companies = companyService.getCompaniesByTenant(pageable);
        return ResponseEntity.ok(GlobalApiResponse.<Page<CompanyDto>>builder()
                .success(true)
                .message("Companies retrieved successfully")
                .data(companies)
                .build());
    }

    @GetMapping("/{id}")
    public ResponseEntity<GlobalApiResponse<CompanyDto>> getCompanyById(@PathVariable Long id) {
        CompanyDto company = companyService.getCompanyById(id);
        return ResponseEntity.ok(GlobalApiResponse.<CompanyDto>builder()
                .success(true)
                .message("Company retrieved successfully")
                .data(company)
                .build());
    }

    @GetMapping("/search")
    public ResponseEntity<GlobalApiResponse<List<CompanyDto>>> searchCompaniesByName(
            @RequestParam String name) {
        List<CompanyDto> companies = companyService.searchCompaniesByName(name);
        return ResponseEntity.ok(GlobalApiResponse.<List<CompanyDto>>builder()
                .success(true)
                .message("Companies retrieved successfully")
                .data(companies)
                .build());
    }

    @GetMapping("/tenant/{tenantId}")
    public ResponseEntity<List<CompanyDto>> getAllByTenant(@PathVariable Long tenantId) {
        return ResponseEntity.ok(companyService.getCompaniesByTenantId(tenantId));
    }

    @GetMapping("/{companyId}/users")
    public ResponseEntity<List<UserDto>> getAllUsersByCompanyId(@PathVariable Long companyId) {
        return ResponseEntity.ok(companyService.getAllUsersByCompanyId(companyId));
    }

    @GetMapping("/tenant/{tenantId}/with-admin-count")
    public ResponseEntity<List<CompanyWithAdminCountDto>> getAllCompaniesWithAdminCountWithTenantId(
            @PathVariable Long tenantId) {
        return ResponseEntity.ok(companyService.getAllCompaniesWithAdminCountWithTenantId(tenantId));
    }
}