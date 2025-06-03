package com.jaysambhu.modulynx.core.module.service;

import com.jaysambhu.modulynx.core.module.dto.ModuleDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Optional;

/**
 * Service interface for managing modules.
 */
public interface ModuleService {

    /**
     * Create a new module
     * 
     * @param moduleDto The module data to create
     * @return The created module
     */
    ModuleDto createModule(ModuleDto moduleDto);

    /**
     * Get a module by ID
     * 
     * @param id The module ID
     * @return Optional containing the module if found
     */
    Optional<ModuleDto> getModuleById(Long id);

    /**
     * Get a module by code
     * 
     * @param code The module code
     * @return Optional containing the module if found
     */
    Optional<ModuleDto> getModuleByCode(String code);

    /**
     * Get all modules with pagination
     * 
     * @param pageable Pagination information
     * @return Page of modules
     */
    Page<ModuleDto> getAllModules(Pageable pageable);

    /**
     * Update a module
     * 
     * @param id        The module ID
     * @param moduleDto The updated module data
     * @return The updated module
     */
    ModuleDto updateModule(Long id, ModuleDto moduleDto);

    /**
     * Delete a module
     * 
     * @param id The module ID
     */
    void deleteModule(Long id);
}