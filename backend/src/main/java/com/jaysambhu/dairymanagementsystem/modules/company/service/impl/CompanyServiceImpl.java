package com.jaysambhu.dairymanagementsystem.modules.company.service.impl;

import com.jaysambhu.dairymanagementsystem.common.exception.BadRequestException;
import com.jaysambhu.dairymanagementsystem.context.TenantContext;
import com.jaysambhu.dairymanagementsystem.modules.company.dto.CompanyDto;
import com.jaysambhu.dairymanagementsystem.modules.company.exception.CompanyNotFoundException;
import com.jaysambhu.dairymanagementsystem.modules.company.model.Company;
import com.jaysambhu.dairymanagementsystem.modules.company.repository.CompanyRepository;
import com.jaysambhu.dairymanagementsystem.modules.company.service.CompanyService;
import com.jaysambhu.dairymanagementsystem.modules.tenant.model.Tenant;
import com.jaysambhu.dairymanagementsystem.modules.tenant.service.TenantService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class CompanyServiceImpl implements CompanyService {

    private final CompanyRepository companyRepository;
    private final TenantService tenantService;

    @Override
    @Transactional
    public CompanyDto createCompany(CompanyDto companyDto) {
        Long tenantId = TenantContext.getCurrentTenant();

        // Check if company with same name already exists for this tenant
        if (companyRepository.existsByNameAndTenantId(companyDto.getName(), tenantId)) {
            throw new BadRequestException(
                    "Company with name '" + companyDto.getName() + "' already exists for this tenant");
        }

        Tenant tenant = tenantService.findById(tenantId);

        Company company = Company.builder()
                .name(companyDto.getName())
                .description(companyDto.getDescription())
                .isActive(companyDto.isActive())
                .tenant(tenant)
                .build();

        Company savedCompany = companyRepository.save(company);
        log.info("Created company: {} for tenant: {}", savedCompany.getName(), tenantId);

        return mapToDto(savedCompany);
    }

    @Override
    @Transactional
    public CompanyDto updateCompany(Long id, CompanyDto companyDto) {
        Long tenantId = TenantContext.getCurrentTenant();

        Company company = companyRepository.findByIdAndTenantId(id, tenantId)
                .orElseThrow(() -> new CompanyNotFoundException(id));

        // Check if updated name conflicts with another company
        if (!company.getName().equals(companyDto.getName()) &&
                companyRepository.existsByNameAndTenantId(companyDto.getName(), tenantId)) {
            throw new BadRequestException(
                    "Company with name '" + companyDto.getName() + "' already exists for this tenant");
        }

        company.setName(companyDto.getName());
        company.setDescription(companyDto.getDescription());
        company.setActive(companyDto.isActive());

        Company updatedCompany = companyRepository.save(company);
        log.info("Updated company: {} for tenant: {}", updatedCompany.getName(), tenantId);

        return mapToDto(updatedCompany);
    }

    @Override
    @Transactional(readOnly = true)
    public List<CompanyDto> getCompaniesByTenant() {
        Long tenantId = TenantContext.getCurrentTenant();

        return companyRepository.findByTenantId(tenantId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Page<CompanyDto> getCompaniesByTenant(Pageable pageable) {
        Long tenantId = TenantContext.getCurrentTenant();

        return companyRepository.findByTenantId(tenantId, pageable)
                .map(this::mapToDto);
    }

    @Override
    @Transactional(readOnly = true)
    public CompanyDto getCompanyById(Long id) {
        Long tenantId = TenantContext.getCurrentTenant();

        Company company = companyRepository.findByIdAndTenantId(id, tenantId)
                .orElseThrow(() -> new CompanyNotFoundException(id));

        return mapToDto(company);
    }

    @Override
    @Transactional
    public void deleteCompany(Long id) {
        Long tenantId = TenantContext.getCurrentTenant();

        Company company = companyRepository.findByIdAndTenantId(id, tenantId)
                .orElseThrow(() -> new CompanyNotFoundException(id));

        companyRepository.delete(company);
        log.info("Deleted company with ID: {} for tenant: {}", id, tenantId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<CompanyDto> searchCompaniesByName(String name) {
        Long tenantId = TenantContext.getCurrentTenant();

        return companyRepository.findByNameContainingIgnoreCaseAndTenantId(name, tenantId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    private CompanyDto mapToDto(Company company) {
        return CompanyDto.builder()
                .id(company.getId())
                .name(company.getName())
                .description(company.getDescription())
                .isActive(company.isActive())
                .tenantId(company.getTenant().getId())
                .createdAt(company.getCreatedAt())
                .createdBy(company.getCreatedBy())
                .updatedAt(company.getUpdatedAt())
                .updatedBy(company.getUpdatedBy())
                .build();
    }
}