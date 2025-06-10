package com.jaysambhu.modulynx.core.user.service;

import com.jaysambhu.modulynx.core.module.model.Module;
import com.jaysambhu.modulynx.core.user.model.Role;
import com.jaysambhu.modulynx.core.user.model.ModuleType;

import java.util.List;

/**
 * Service interface for managing module-specific roles.
 */
public interface ModuleRoleService {

    /**
     * Creates roles for a specific module based on the module's role enum.
     *
     * @param module The module to create roles for
     * @return List of created roles
     */
    List<Role> createModuleRoles(Module module);

    /**
     * Gets all roles for a specific module.
     *
     * @param moduleId The ID of the module
     * @return List of roles for the module
     */
    List<Role> getModuleRoles(Long moduleId);

    /**
     * Gets all roles for a specific module type.
     *
     * @param moduleType The type of module
     * @return List of roles for the module type
     */
    List<Role> getModuleTypeRoles(ModuleType moduleType);

    /**
     * Gets all global roles (roles not tied to any module).
     *
     * @return List of global roles
     */
    List<Role> getGlobalRoles();
}