package com.jaysambhu.modulynx.core.module.service.impl;

import com.jaysambhu.modulynx.common.exception.BadRequestException;
import com.jaysambhu.modulynx.core.module.dto.ModuleDto;
import com.jaysambhu.modulynx.core.module.dto.TenantModuleDto;
import com.jaysambhu.modulynx.core.module.model.Module;
import com.jaysambhu.modulynx.core.module.model.TenantModule;
import com.jaysambhu.modulynx.core.module.repository.ModuleRepository;
import com.jaysambhu.modulynx.core.module.repository.TenantModuleRepository;
import com.jaysambhu.modulynx.core.module.service.TenantModuleService;
import com.jaysambhu.modulynx.core.tenant.model.Tenant;
import com.jaysambhu.modulynx.core.tenant.repository.TenantRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Implementation of the TenantModuleService interface.
 */
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class TenantModuleServiceImpl implements TenantModuleService {

        private final TenantModuleRepository tenantModuleRepository;
        private final TenantRepository tenantRepository;
        private final ModuleRepository moduleRepository;

        @Override
        public TenantModuleDto assignModuleToTenant(TenantModuleDto tenantModuleDto) {
                Tenant tenant = tenantRepository.findById(tenantModuleDto.getTenantId())
                                .orElseThrow(
                                                () -> new BadRequestException("Tenant not found with id: "
                                                                + tenantModuleDto.getTenantId()));

                Module module = moduleRepository.findById(tenantModuleDto.getModuleId())
                                .orElseThrow(
                                                () -> new BadRequestException("Module not found with id: "
                                                                + tenantModuleDto.getModuleId()));

                if (tenantModuleRepository.existsByTenantIdAndModuleId(tenant.getId(), module.getId())) {
                        throw new BadRequestException("Module is already assigned to tenant");
                }

                TenantModule tenantModule = TenantModule.builder()
                                .tenant(tenant)
                                .module(module)
                                .enabled(tenantModuleDto.isEnabled())
                                .build();

                tenantModule = tenantModuleRepository.save(tenantModule);
                return mapToDto(tenantModule);
        }

        @Override
        @Transactional(readOnly = true)
        public List<TenantModuleDto> getModulesByTenantId(Long tenantId) {
                return tenantModuleRepository.findByTenantId(tenantId).stream()
                                .map(this::mapToDto)
                                .collect(Collectors.toList());
        }

        @Override
        @Transactional(readOnly = true)
        public List<TenantModuleDto> getEnabledModulesByTenantId(Long tenantId) {
                return tenantModuleRepository.findByTenantIdAndEnabled(tenantId, true).stream()
                                .map(this::mapToDto)
                                .collect(Collectors.toList());
        }

        @Override
        @Transactional(readOnly = true)
        public Optional<TenantModuleDto> getTenantModule(Long tenantId, Long moduleId) {
                return tenantModuleRepository.findByTenantIdAndModuleId(tenantId, moduleId)
                                .map(this::mapToDto);
        }

        @Override
        public TenantModuleDto toggleModuleForTenant(Long tenantId, Long moduleId, boolean enabled) {
                TenantModule tenantModule = tenantModuleRepository.findByTenantIdAndModuleId(tenantId, moduleId)
                                .orElseThrow(() -> new BadRequestException("Tenant-Module relationship not found"));

                tenantModule.setEnabled(enabled);
                tenantModule = tenantModuleRepository.save(tenantModule);
                return mapToDto(tenantModule);
        }

        @Override
        public void removeModuleFromTenant(Long tenantId, Long moduleId) {
                TenantModule tenantModule = tenantModuleRepository.findByTenantIdAndModuleId(tenantId, moduleId)
                                .orElseThrow(() -> new BadRequestException("Tenant-Module relationship not found"));

                tenantModuleRepository.delete(tenantModule);
        }

        private TenantModuleDto mapToDto(TenantModule entity) {
                return TenantModuleDto.builder()
                                .id(entity.getId())
                                .tenantId(entity.getTenant().getId())
                                .moduleId(entity.getModule().getId())
                                .enabled(entity.isEnabled())
                                .enabledAt(entity.getEnabledAt())
                                .disabledAt(entity.getDisabledAt())
                                .module(ModuleDto.builder()
                                                .id(entity.getModule().getId())
                                                .name(entity.getModule().getName())
                                                .code(entity.getModule().getCode())
                                                .description(entity.getModule().getDescription())
                                                .active(entity.getModule().isActive())
                                                .build())
                                .build();
        }
}