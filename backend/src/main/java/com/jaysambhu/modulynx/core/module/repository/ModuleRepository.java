package com.jaysambhu.modulynx.core.module.repository;

import com.jaysambhu.modulynx.core.module.model.Module;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repository for the Module entity.
 */
@Repository
public interface ModuleRepository extends JpaRepository<Module, Long> {

    /**
     * Find a module by its unique code
     * 
     * @param code The code to search for
     * @return Optional containing the module if found
     */
    Optional<Module> findByCode(String code);

    /**
     * Find an active module by code
     * 
     * @param code   The code to search for
     * @param active The active status to match
     * @return Optional containing the module if found
     */
    Optional<Module> findByCodeAndActive(String code, boolean active);

    /**
     * Check if a module exists with the given code
     * 
     * @param code The code to check
     * @return true if a module exists with this code
     */
    boolean existsByCode(String code);
}