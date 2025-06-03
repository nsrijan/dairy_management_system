package com.jaysambhu.modulynx.core.module.repository;

import com.jaysambhu.modulynx.core.module.model.Feature;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository for the Feature entity.
 */
@Repository
public interface FeatureRepository extends JpaRepository<Feature, Long> {

    /**
     * Find a feature by its unique code
     * 
     * @param code The code to search for
     * @return Optional containing the feature if found
     */
    Optional<Feature> findByCode(String code);

    /**
     * Find all features for a specific module
     * 
     * @param moduleId The module ID to filter by
     * @return List of features for the module
     */
    List<Feature> findByModuleId(Long moduleId);

    /**
     * Find all active features for a specific module
     * 
     * @param moduleId The module ID to filter by
     * @param active   The active status to match
     * @return List of active features for the module
     */
    List<Feature> findByModuleIdAndActive(Long moduleId, boolean active);

    /**
     * Check if a feature exists with the given code
     * 
     * @param code The code to check
     * @return true if a feature exists with this code
     */
    boolean existsByCode(String code);
}