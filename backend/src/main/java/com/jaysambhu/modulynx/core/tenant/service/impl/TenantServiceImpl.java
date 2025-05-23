package com.jaysambhu.modulynx.core.tenant.service.impl;

import com.jaysambhu.modulynx.common.exception.BadRequestException;
import com.jaysambhu.modulynx.common.exception.InvalidTenantException;
import com.jaysambhu.modulynx.common.exception.ResourceNotFoundException;
import com.jaysambhu.modulynx.common.exception.TenantNotFoundException;
import com.jaysambhu.modulynx.context.TenantContext;
import com.jaysambhu.modulynx.core.tenant.dto.TenantDto;
import com.jaysambhu.modulynx.core.tenant.model.Tenant;
import com.jaysambhu.modulynx.core.tenant.repository.TenantRepository;
import com.jaysambhu.modulynx.core.tenant.service.TenantService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class TenantServiceImpl implements TenantService {

    private final TenantRepository tenantRepository;

    @Override
    public Tenant findBySlug(String slug) {
        return tenantRepository.findBySlug(slug)
                .orElseThrow(() -> new TenantNotFoundException(slug));
    }

    @Override
    public Tenant findActiveBySlug(String slug) {
        Tenant tenant = findBySlug(slug);
        if (!tenant.isActive()) {
            throw new InvalidTenantException(slug);
        }
        return tenant;
    }

    @Override
    public Tenant findById(Long id) {
        return tenantRepository.findById(id)
                .orElseThrow(() -> new TenantNotFoundException(id));
    }

    @Override
    @Transactional(readOnly = true)
    public List<TenantDto> findAll() {
        return tenantRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public TenantDto create(TenantDto tenantDto) {
        if (tenantRepository.findBySlug(tenantDto.getSlug()).isPresent()) {
            throw new BadRequestException("Tenant with slug '" + tenantDto.getSlug() + "' already exists");
        }

        Tenant tenant = Tenant.builder()
                .name(tenantDto.getName())
                .slug(tenantDto.getSlug())
                .isActive(tenantDto.isActive())
                .moduleType(tenantDto.getModuleType())
                .currency(tenantDto.getCurrency())
                .timezone(tenantDto.getTimezone())
                .build();

        Tenant savedTenant = tenantRepository.save(tenant);
        return mapToDto(savedTenant);
    }

    @Override
    @Transactional
    public TenantDto update(Long id, TenantDto tenantDto) {
        Tenant existingTenant = findById(id);

        // If slug is being changed, check for uniqueness
        if (!existingTenant.getSlug().equals(tenantDto.getSlug()) &&
                tenantRepository.findBySlug(tenantDto.getSlug()).isPresent()) {
            throw new BadRequestException("Tenant with slug '" + tenantDto.getSlug() + "' already exists");
        }

        existingTenant.setName(tenantDto.getName());
        existingTenant.setSlug(tenantDto.getSlug());
        existingTenant.setActive(tenantDto.isActive());
        existingTenant.setModuleType(tenantDto.getModuleType());
        existingTenant.setCurrency(tenantDto.getCurrency());
        existingTenant.setTimezone(tenantDto.getTimezone());

        Tenant updatedTenant = tenantRepository.save(existingTenant);
        return mapToDto(updatedTenant);
    }

    @Override
    @Transactional
    public void delete(Long id) {
        if (!tenantRepository.existsById(id)) {
            throw new TenantNotFoundException(id);
        }
        tenantRepository.deleteById(id);
    }

    @Override
    public TenantDto getCurrentTenant() {
        Long currentTenantId = TenantContext.getCurrentTenant();
        if (currentTenantId == null) {
            log.warn("No current tenant found in context");
            throw new ResourceNotFoundException("Current tenant not found");
        }

        Tenant tenant = findById(currentTenantId);
        return mapToDto(tenant);
    }

    @Override
    public TenantDto mapToDto(Tenant tenant) {
        TenantDto dto = TenantDto.builder()
                .id(tenant.getId())
                .name(tenant.getName())
                .slug(tenant.getSlug())
                .isActive(tenant.isActive())
                .moduleType(tenant.getModuleType())
                .currency(tenant.getCurrency())
                .timezone(tenant.getTimezone())
                .createdAt(tenant.getCreatedAt())
                .createdBy(tenant.getCreatedBy())
                .updatedAt(tenant.getUpdatedAt())
                .updatedBy(tenant.getUpdatedBy())
                .build();

        // Set subdomain to match slug for frontend compatibility
        dto.setSubdomain(tenant.getSlug());
        return dto;
    }

    @Override
    @Transactional
    public TenantDto updateStatus(Long id, boolean active) {
        Tenant tenant = findById(id);
        tenant.setActive(active);
        Tenant updatedTenant = tenantRepository.save(tenant);
        return mapToDto(updatedTenant);
    }
}