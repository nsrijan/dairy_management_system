package com.jaysambhu.modulynx.core.user.service.impl;

import com.jaysambhu.modulynx.core.module.model.Module;
import com.jaysambhu.modulynx.core.user.model.Role;
import com.jaysambhu.modulynx.core.user.model.RoleName;
import com.jaysambhu.modulynx.core.user.model.ModuleType;
import com.jaysambhu.modulynx.core.user.repository.RoleRepository;
import com.jaysambhu.modulynx.core.user.service.ModuleRoleService;
import com.jaysambhu.modulynx.modules.dairy.roles.DairyRoleEnum;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class ModuleRoleServiceImpl implements ModuleRoleService {

    private final RoleRepository roleRepository;

    @Override
    @Transactional
    public List<Role> createModuleRoles(Module module) {
        List<Role> roles = new ArrayList<>();

        // Create roles based on module type
        switch (module.getModuleType()) {
            case DAIRY:
                roles.addAll(createDairyRoles(module));
                break;
            case POTTERY:
                // TODO: Implement when pottery roles are defined
                break;
            case GARMENTS:
                // TODO: Implement when garments roles are defined
                break;
            default:
                log.warn("Unknown module type: {}", module.getModuleType());
        }

        return roles;
    }

    @Override
    @Transactional(readOnly = true)
    public List<Role> getModuleRoles(Long moduleId) {
        return roleRepository.findByModuleId(moduleId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Role> getModuleTypeRoles(ModuleType moduleType) {
        return roleRepository.findByModuleType(moduleType);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Role> getGlobalRoles() {
        return roleRepository.findByModuleIsNull();
    }

    private List<Role> createDairyRoles(Module module) {
        List<Role> roles = new ArrayList<>();

        for (DairyRoleEnum dairyRole : DairyRoleEnum.values()) {
            Role role = Role.builder()
                    .name(RoleName.valueOf(dairyRole.name()))
                    .description(dairyRole.getDescription())
                    .roleType(dairyRole.getRoleType())
                    .module(module)
                    .moduleType(ModuleType.DAIRY)
                    .build();

            roles.add(roleRepository.save(role));
            log.info("Created dairy role: {} for module: {}", dairyRole.name(), module.getId());
        }

        return roles;
    }
}