package com.jaysambhu.modulynx.core.company.service.impl;

import com.jaysambhu.modulynx.common.exception.BadRequestException;
import com.jaysambhu.modulynx.common.service.AbstractTenantAwareService;
import com.jaysambhu.modulynx.context.TenantContext;
import com.jaysambhu.modulynx.core.company.dto.CompanyDto;
import com.jaysambhu.modulynx.core.company.dto.CompanyWithAdminCountDto;
import com.jaysambhu.modulynx.core.company.exception.CompanyNotFoundException;
import com.jaysambhu.modulynx.core.company.model.Company;
import com.jaysambhu.modulynx.core.company.repository.CompanyRepository;
import com.jaysambhu.modulynx.core.company.service.CompanyService;
import com.jaysambhu.modulynx.core.tenant.model.Tenant;
import com.jaysambhu.modulynx.core.tenant.service.TenantService;
import com.jaysambhu.modulynx.core.user.dto.UserDto;
import com.jaysambhu.modulynx.core.user.model.User;
import com.jaysambhu.modulynx.core.user.model.UserCompanyRole;
import com.jaysambhu.modulynx.core.user.repository.UserCompanyRoleRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class CompanyServiceImpl extends AbstractTenantAwareService implements CompanyService {

    private final CompanyRepository companyRepository;
    private final TenantService tenantService;
    private final UserCompanyRoleRepository userCompanyRoleRepository;

    @Override
    @Transactional
    public CompanyDto createCompany(CompanyDto companyDto) {
        Long tenantId = TenantContext.getCurrentTenant();

        // Super admin context is not allowed for company creation
        // as companies must belong to a specific tenant
        if (TenantContext.isSuperAdmin()) {
            throw new BadRequestException("Cannot create company in super admin context - tenant must be specified");
        }

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
        // Find company with or without tenant filtering
        Company company = findCompanyById(id)
                .orElseThrow(() -> new CompanyNotFoundException(id));

        if (!TenantContext.isSuperAdmin()) {
            Long tenantId = TenantContext.getCurrentTenant();

            // Check if updated name conflicts with another company in this tenant
            if (!company.getName().equals(companyDto.getName()) &&
                    companyRepository.existsByNameAndTenantId(companyDto.getName(), tenantId)) {
                throw new BadRequestException(
                        "Company with name '" + companyDto.getName() + "' already exists for this tenant");
            }
        }

        company.setName(companyDto.getName());
        company.setDescription(companyDto.getDescription());
        company.setActive(companyDto.isActive());

        Company updatedCompany = companyRepository.save(company);
        log.info("Updated company: {} with ID: {}", updatedCompany.getName(), id);

        return mapToDto(updatedCompany);
    }

    @Override
    @Transactional(readOnly = true)
    public List<CompanyDto> getCompaniesByTenant() {
        return findAllTenantAware(
                tenantId -> companyRepository.findByTenantId(tenantId),
                companyRepository::findAll).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Page<CompanyDto> getCompaniesByTenant(Pageable pageable) {
        return findAllTenantAware(
                pageable,
                tenantId -> companyRepository.findByTenantId(tenantId, pageable),
                companyRepository::findAll).map(this::mapToDto);
    }

    @Override
    @Transactional(readOnly = true)
    public CompanyDto getCompanyById(Long id) {
        Company company = findCompanyById(id)
                .orElseThrow(() -> new CompanyNotFoundException(id));

        return mapToDto(company);
    }

    @Override
    @Transactional
    public void deleteCompany(Long id) {
        Company company = findCompanyById(id)
                .orElseThrow(() -> new CompanyNotFoundException(id));

        companyRepository.delete(company);
        log.info("Deleted company with ID: {}", id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<CompanyDto> searchCompaniesByName(String name) {
        if (TenantContext.isSuperAdmin()) {
            // For super admin, search across all tenants
            return companyRepository.findAll().stream()
                    .filter(company -> company.getName().toLowerCase().contains(name.toLowerCase()))
                    .map(this::mapToDto)
                    .collect(Collectors.toList());
        } else {
            Long tenantId = TenantContext.getCurrentTenant();
            return companyRepository.findByNameContainingIgnoreCaseAndTenantId(name, tenantId).stream()
                    .map(this::mapToDto)
                    .collect(Collectors.toList());
        }
    }

    /**
     * Find company by ID with tenant-aware logic
     */
    private Optional<Company> findCompanyById(Long id) {
        return findByIdTenantAware(
                id,
                companyRepository,
                companyId -> {
                    Long tenantId = TenantContext.getCurrentTenant();
                    return companyRepository.findByIdAndTenantId(companyId, tenantId);
                });
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

    @Override
    @Transactional(readOnly = true)
    public List<CompanyDto> getCompaniesByTenantId(Long tenantId) {
        // This method is intended for SYSTEM_ADMIN to view companies of any tenant
        if (!TenantContext.isSuperAdmin()) {
            // Although the controller has @PreAuthorize, adding a check here for safety
            throw new SecurityException("Access denied: Only SYSTEM_ADMIN can view companies by tenant ID");
        }
        return companyRepository.findByTenantId(tenantId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<CompanyWithAdminCountDto> getAllCompaniesWithAdminCountWithTenantId(Long tenantId) {
        // pull all companies with tenant id
        List<Company> companies = companyRepository.findByTenantId(tenantId);

        // for each company, pull all admins
        return companies.stream().map(company -> {
            int adminCount = userCompanyRoleRepository.countAdminsByCompanyId(company.getId());
            int userCount = userCompanyRoleRepository.countUsersByCompanyId(company.getId());

            return CompanyWithAdminCountDto.builder()
                    .companyId(company.getId())
                    .companyName(company.getName())
                    .createdAt(company.getCreatedAt())
                    .updatedAt(company.getUpdatedAt())
                    .adminCount(adminCount)
                    .userCount(userCount)
                    .isActive(company.isActive())
                    .build();
        }).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserDto> getAllUsersByCompanyId(Long companyId) {
        return userCompanyRoleRepository.findByCompanyId(companyId).stream()
                .map(this::mapUserCompanyRoleToUserDto)
                .collect(Collectors.toList());
    }

    private UserDto mapUserCompanyRoleToUserDto(UserCompanyRole userCompanyRole) {
        User user = userCompanyRole.getUser();
        return UserDto.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .isActive(user.isActive())
                .build();
    }
}