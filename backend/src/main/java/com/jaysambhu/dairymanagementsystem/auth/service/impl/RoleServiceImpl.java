package com.jaysambhu.dairymanagementsystem.auth.service.impl;


import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import com.jaysambhu.dairymanagementsystem.auth.model.Role;
import com.jaysambhu.dairymanagementsystem.auth.repository.RoleRepository;
import com.jaysambhu.dairymanagementsystem.auth.service.RoleService;
import com.jaysambhu.dairymanagementsystem.commons.RoleType;

@Service
@RequiredArgsConstructor
public class RoleServiceImpl implements RoleService {

    private final RoleRepository roleRepository;

    @Override
    public Role findByName(RoleType roleType) {
        return roleRepository.findByName(roleType.name())
                .orElseThrow(() -> new RuntimeException("Role not found: " + roleType));
    }
}