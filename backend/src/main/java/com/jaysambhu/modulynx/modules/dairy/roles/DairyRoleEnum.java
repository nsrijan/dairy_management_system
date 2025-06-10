package com.jaysambhu.modulynx.modules.dairy.roles;

import com.jaysambhu.modulynx.core.user.model.RoleType;

/**
 * Enum representing roles specific to the dairy module.
 */
public enum DairyRoleEnum {
    DAIRY_MANAGER("Dairy Manager", "Manages overall dairy operations", RoleType.COMPANY),
    MILK_COLLECTION_MANAGER("Milk Collection Manager", "Manages milk collection operations", RoleType.COMPANY),
    PRODUCTION_MANAGER("Production Manager", "Manages dairy production processes", RoleType.COMPANY),
    INVENTORY_MANAGER("Inventory Manager", "Manages dairy inventory", RoleType.COMPANY),
    QUALITY_CONTROL("Quality Control", "Manages quality control processes", RoleType.COMPANY),
    FARMER_RELATIONS("Farmer Relations", "Manages farmer relationships", RoleType.COMPANY);

    private final String displayName;
    private final String description;
    private final RoleType roleType;

    DairyRoleEnum(String displayName, String description, RoleType roleType) {
        this.displayName = displayName;
        this.description = description;
        this.roleType = roleType;
    }

    public String getDisplayName() {
        return displayName;
    }

    public String getDescription() {
        return description;
    }

    public RoleType getRoleType() {
        return roleType;
    }
}