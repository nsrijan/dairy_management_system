package com.jaysambhu.modulynx.core.module.service.impl;

import com.jaysambhu.modulynx.common.exception.BadRequestException;
import com.jaysambhu.modulynx.core.module.dto.FeatureDto;
import com.jaysambhu.modulynx.core.module.dto.ModuleDto;
import com.jaysambhu.modulynx.core.module.model.Feature;
import com.jaysambhu.modulynx.core.module.model.Module;
import com.jaysambhu.modulynx.core.module.repository.FeatureRepository;
import com.jaysambhu.modulynx.core.module.repository.ModuleRepository;
import com.jaysambhu.modulynx.core.module.service.ModuleService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
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
    private final FeatureRepository featureRepository;

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
        log.info("Received update request for module ID: {} with data: {}", id, moduleDto);

        Module module = moduleRepository.findById(id)
                .orElseThrow(() -> new BadRequestException("Module not found with id: " + id));

        log.info("Found existing module: {}", module);

        if (!module.getCode().equals(moduleDto.getCode()) &&
                moduleRepository.existsByCode(moduleDto.getCode())) {
            throw new BadRequestException("Module with code " + moduleDto.getCode() + " already exists");
        }

        // Keep existing values if new values are null
        if (moduleDto.getName() == null)
            moduleDto.setName(module.getName());
        if (moduleDto.getCode() == null)
            moduleDto.setCode(module.getCode());
        if (moduleDto.getDescription() == null)
            moduleDto.setDescription(module.getDescription());

        log.info("Merged moduleDto with existing values: {}", moduleDto);

        updateEntityFromDto(module, moduleDto);
        module = moduleRepository.save(module);

        ModuleDto result = mapToDto(module);
        log.info("Updated module result: {}", result);

        return result;
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
            Set<String> existingFeatureCodes = new HashSet<>();
            Set<String> existingFeatureNames = new HashSet<>();

            // Get all existing feature codes and names
            featureRepository.findAll().forEach(feature -> {
                existingFeatureCodes.add(feature.getCode());
                existingFeatureNames.add(feature.getName().toLowerCase());
            });

            // Process features, skipping duplicates
            dto.getFeatures().forEach(featureDto -> {
                String featureCode = featureDto.getName().toUpperCase().replaceAll("\\s+", "_");
                String featureName = featureDto.getName().toLowerCase();

                // Skip if feature code or name already exists
                if (!existingFeatureCodes.contains(featureCode) &&
                        !existingFeatureNames.contains(featureName)) {
                    Feature feature = Feature.builder()
                            .name(featureDto.getName())
                            .code(featureCode)
                            .description(featureDto.getDescription())
                            .active(featureDto.isActive())
                            .module(module)
                            .build();
                    module.getFeatures().add(feature);

                    // Add to tracking sets
                    existingFeatureCodes.add(featureCode);
                    existingFeatureNames.add(featureName);
                } else {
                    log.info("Skipping duplicate feature: {} (code: {})", featureDto.getName(), featureCode);
                }
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
        log.info("Updating entity from DTO. Entity before update: {}", entity);
        log.info("Update DTO: {}", dto);

        // Only update fields if they are not null
        if (dto.getName() != null)
            entity.setName(dto.getName());
        if (dto.getCode() != null)
            entity.setCode(dto.getCode());
        if (dto.getDescription() != null)
            entity.setDescription(dto.getDescription());
        entity.setActive(dto.isActive());

        // Only update features if they are explicitly included in the DTO
        if (dto.getFeatures() != null && !dto.getFeatures().isEmpty()) {
            log.info("Updating features. Received features: {}", dto.getFeatures());
            Set<String> existingFeatureCodes = new HashSet<>();
            Set<String> existingFeatureNames = new HashSet<>();
            Set<Feature> updatedFeatures = new HashSet<>();

            // Get all existing feature codes and names except current module's features
            featureRepository.findAll().stream()
                    .filter(feature -> !feature.getModule().getId().equals(entity.getId()))
                    .forEach(feature -> {
                        existingFeatureCodes.add(feature.getCode());
                        existingFeatureNames.add(feature.getName().toLowerCase());
                    });

            log.info("Existing feature codes: {}", existingFeatureCodes);
            log.info("Existing feature names: {}", existingFeatureNames);

            // Process features, skipping duplicates
            dto.getFeatures().forEach(featureDto -> {
                String featureCode = featureDto.getName().toUpperCase().replaceAll("\\s+", "_");
                String featureName = featureDto.getName().toLowerCase();

                log.info("Processing feature - name: {}, code: {}", featureName, featureCode);

                // First check if this is an existing feature by ID
                if (featureDto.getId() != null) {
                    // Find the existing feature in the current module
                    Optional<Feature> existingFeature = entity.getFeatures().stream()
                            .filter(f -> f.getId().equals(featureDto.getId()))
                            .findFirst();

                    if (existingFeature.isPresent()) {
                        Feature feature = existingFeature.get();
                        // Update existing feature properties
                        feature.setName(featureDto.getName());
                        feature.setCode(featureCode);
                        feature.setDescription(featureDto.getDescription());
                        feature.setActive(featureDto.isActive());
                        updatedFeatures.add(feature);
                        return; // Skip the rest of this iteration
                    }
                }

                // Skip if feature code or name already exists in other modules
                if (!existingFeatureCodes.contains(featureCode) &&
                        !existingFeatureNames.contains(featureName)) {
                    Feature feature = Feature.builder()
                            .name(featureDto.getName())
                            .code(featureCode)
                            .description(featureDto.getDescription())
                            .active(featureDto.isActive())
                            .module(entity)
                            .build();
                    updatedFeatures.add(feature);

                    // Add to tracking sets
                    existingFeatureCodes.add(featureCode);
                    existingFeatureNames.add(featureName);

                    log.info("Added new feature: {}", feature);
                } else {
                    log.info("Skipping duplicate feature during update: {} (code: {})", featureDto.getName(),
                            featureCode);
                }
            });

            // Update the module's features
            entity.getFeatures().clear();
            entity.getFeatures().addAll(updatedFeatures);
        }

        log.info("Entity after update: {}", entity);
    }
}