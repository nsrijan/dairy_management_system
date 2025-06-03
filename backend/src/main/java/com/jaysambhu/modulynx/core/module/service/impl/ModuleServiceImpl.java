package com.jaysambhu.modulynx.core.module.service.impl;

import com.jaysambhu.modulynx.common.exception.BadRequestException;
import com.jaysambhu.modulynx.core.module.dto.FeatureDto;
import com.jaysambhu.modulynx.core.module.dto.ModuleDto;
import com.jaysambhu.modulynx.core.module.model.Feature;
import com.jaysambhu.modulynx.core.module.model.Module;
import com.jaysambhu.modulynx.core.module.repository.ModuleRepository;
import com.jaysambhu.modulynx.core.module.service.ModuleService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Implementation of the ModuleService interface.
 */
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class ModuleServiceImpl implements ModuleService {

    private final ModuleRepository moduleRepository;

    @Override
    public ModuleDto createModule(ModuleDto moduleDto) {
        if (moduleRepository.existsByCode(moduleDto.getCode())) {
            throw new BadRequestException("Module with code " + moduleDto.getCode() + " already exists");
        }

        Module module = mapToEntity(moduleDto);
        module = moduleRepository.save(module);
        return mapToDto(module);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<ModuleDto> getModuleById(Long id) {
        return moduleRepository.findById(id)
                .map(this::mapToDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<ModuleDto> getModuleByCode(String code) {
        return moduleRepository.findByCode(code)
                .map(this::mapToDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ModuleDto> getAllModules(Pageable pageable) {
        return moduleRepository.findAll(pageable)
                .map(this::mapToDto);
    }

    @Override
    public ModuleDto updateModule(Long id, ModuleDto moduleDto) {
        Module module = moduleRepository.findById(id)
                .orElseThrow(() -> new BadRequestException("Module not found with id: " + id));

        if (!module.getCode().equals(moduleDto.getCode()) &&
                moduleRepository.existsByCode(moduleDto.getCode())) {
            throw new BadRequestException("Module with code " + moduleDto.getCode() + " already exists");
        }

        updateEntityFromDto(module, moduleDto);
        module = moduleRepository.save(module);
        return mapToDto(module);
    }

    @Override
    public void deleteModule(Long id) {
        if (!moduleRepository.existsById(id)) {
            throw new BadRequestException("Module not found with id: " + id);
        }
        moduleRepository.deleteById(id);
    }

    private Module mapToEntity(ModuleDto dto) {
        Module module = Module.builder()
                .name(dto.getName())
                .code(dto.getCode())
                .description(dto.getDescription())
                .active(dto.isActive())
                .features(new HashSet<>())
                .build();

        // If features are provided in DTO, map them
        if (dto.getFeatures() != null) {
            dto.getFeatures().forEach(featureDto -> {
                Feature feature = Feature.builder()
                        .name(featureDto.getName())
                        .code(featureDto.getName().toUpperCase())
                        .description(featureDto.getDescription())
                        .active(featureDto.isActive())
                        .module(module)
                        .build();
                module.getFeatures().add(feature);
            });
        }

        return module;
    }

    private ModuleDto mapToDto(Module entity) {
        return ModuleDto.builder()
                .id(entity.getId())
                .name(entity.getName())
                .code(entity.getCode())
                .description(entity.getDescription())
                .active(entity.isActive())
                .features(entity.getFeatures() != null ? entity.getFeatures().stream()
                        .map(feature -> FeatureDto.builder()
                                .id(feature.getId())
                                .name(feature.getName())
                                .code(feature.getCode())
                                .description(feature.getDescription())
                                .active(feature.isActive())
                                .moduleId(feature.getModule().getId())
                                .build())
                        .collect(Collectors.toSet()) : new HashSet<>())
                .build();
    }

    private void updateEntityFromDto(Module entity, ModuleDto dto) {
        entity.setName(dto.getName());
        entity.setCode(dto.getCode());
        entity.setDescription(dto.getDescription());
        entity.setActive(dto.isActive());

        // Update features if provided
        if (dto.getFeatures() != null) {
            // Clear existing features
            entity.getFeatures().clear();

            // Add new features
            dto.getFeatures().forEach(featureDto -> {
                Feature feature = Feature.builder()
                        .name(featureDto.getName())
                        .code(featureDto.getCode())
                        .description(featureDto.getDescription())
                        .active(featureDto.isActive())
                        .module(entity)
                        .build();
                entity.getFeatures().add(feature);
            });
        }
    }
}