package com.jaysambhu.modulynx.common.service;

import com.jaysambhu.modulynx.context.TenantContext;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.function.Function;
import java.util.function.Supplier;

/**
 * Abstract base class for services that need to be tenant-aware.
 * Provides utility methods to bypass tenant filtering when in super admin
 * context.
 */
public abstract class AbstractTenantAwareService {

    /**
     * Execute a function that requires tenant filtering, but bypass it for super
     * admin
     * 
     * @param <T>                 The return type
     * @param tenantAwareFunction The function to execute with tenant ID
     * @param superAdminFunction  The function to execute for super admin (without
     *                            tenant filtering)
     * @return The result of the appropriate function
     */
    protected <T> T executeTenantAware(Function<Long, T> tenantAwareFunction, Supplier<T> superAdminFunction) {
        if (TenantContext.isSuperAdmin()) {
            return superAdminFunction.get();
        } else {
            Long tenantId = TenantContext.getCurrentTenant();
            return tenantAwareFunction.apply(tenantId);
        }
    }

    /**
     * Find an entity by ID, with or without tenant filtering depending on context
     * 
     * @param <T>               The entity type
     * @param <ID>              The ID type
     * @param id                The entity ID to find
     * @param repository        The JPA repository
     * @param tenantAwareFinder Function to find the entity with tenant filtering
     * @return Optional containing the entity if found
     */
    protected <T, ID> Optional<T> findByIdTenantAware(ID id, JpaRepository<T, ID> repository,
            Function<ID, Optional<T>> tenantAwareFinder) {
        return executeTenantAware(
                tenantId -> tenantAwareFinder.apply(id),
                () -> repository.findById(id));
    }

    /**
     * Find all entities, with or without tenant filtering depending on context
     * 
     * @param <T>               The entity type
     * @param tenantAwareFinder Function to find entities with tenant filtering
     * @param allEntitiesFinder Function to find all entities without filtering
     * @return List of entities
     */
    protected <T> List<T> findAllTenantAware(Function<Long, List<T>> tenantAwareFinder,
            Supplier<List<T>> allEntitiesFinder) {
        return executeTenantAware(
                tenantAwareFinder,
                allEntitiesFinder);
    }

    /**
     * Find all entities with pagination, with or without tenant filtering depending
     * on context
     * 
     * @param <T>               The entity type
     * @param pageable          Pagination information
     * @param tenantAwareFinder Function to find entities with tenant filtering
     * @param allEntitiesFinder Function to find all entities without filtering
     * @return Page of entities
     */
    protected <T> Page<T> findAllTenantAware(Pageable pageable,
            Function<Long, Page<T>> tenantAwareFinder,
            Function<Pageable, Page<T>> allEntitiesFinder) {
        return executeTenantAware(
                tenantId -> tenantAwareFinder.apply(tenantId),
                () -> allEntitiesFinder.apply(pageable));
    }
}