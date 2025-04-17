package com.jaysambhu.dairymanagementsystem.auth.service;

import com.jaysambhu.dairymanagementsystem.auth.model.Role;
import com.jaysambhu.dairymanagementsystem.commons.RoleType;

public interface RoleService {
    Role findByName(RoleType roleType);
}