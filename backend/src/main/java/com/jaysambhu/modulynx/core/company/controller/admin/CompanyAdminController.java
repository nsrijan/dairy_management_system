package com.jaysambhu.modulynx.core.company.controller.admin;

import com.jaysambhu.modulynx.common.response.GlobalApiResponse;
import com.jaysambhu.modulynx.core.company.dto.CompanyDto;
import com.jaysambhu.modulynx.core.company.service.CompanyService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/companies")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('SYSTEM_ADMIN', 'TENANT_ADMIN')")
public class CompanyAdminController {

        private final CompanyService companyService;

        @PostMapping
        public ResponseEntity<GlobalApiResponse<CompanyDto>> createCompany(@Valid @RequestBody CompanyDto companyDto) {
                CompanyDto createdCompany = companyService.createCompany(companyDto);
                return ResponseEntity.status(HttpStatus.CREATED).body(GlobalApiResponse.<CompanyDto>builder()
                                .success(true)
                                .message("Company created successfully")
                                .data(createdCompany)
                                .build());
        }

        @PutMapping("/{id}")
        public ResponseEntity<GlobalApiResponse<CompanyDto>> updateCompany(
                        @PathVariable Long id, @Valid @RequestBody CompanyDto companyDto) {
                CompanyDto updatedCompany = companyService.updateCompany(id, companyDto);
                return ResponseEntity.ok(GlobalApiResponse.<CompanyDto>builder()
                                .success(true)
                                .message("Company updated successfully")
                                .data(updatedCompany)
                                .build());
        }

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

        @DeleteMapping("/{id}")
        public ResponseEntity<GlobalApiResponse<Void>> deleteCompany(@PathVariable Long id) {
                companyService.deleteCompany(id);
                return ResponseEntity.ok(GlobalApiResponse.<Void>builder()
                                .success(true)
                                .message("Company deleted successfully")
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
}