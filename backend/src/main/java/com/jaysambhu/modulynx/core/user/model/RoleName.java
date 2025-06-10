package com.jaysambhu.modulynx.core.user.model;

/**
 * Enum representing the available roles in the system.
 */
public enum RoleName {
    // System-level roles (global)
    SYSTEM_ADMIN("System Administrator"),
    TENANT_ADMIN("Tenant Administrator"),
    COMPANY_ADMIN("Company Administrator"),

    // Generic company roles (global)
    SUPPLIER("Supplier"),
    CUSTOMER("Customer"),

    // Dairy module roles
    DAIRY_MANAGER("Dairy Manager"),
    MILK_COLLECTION_MANAGER("Milk Collection Manager"),
    PRODUCTION_MANAGER("Production Manager"),
    INVENTORY_MANAGER("Inventory Manager"),
    QUALITY_CONTROL("Quality Control"),
    FARMER_RELATIONS("Farmer Relations"),
    FARMER("Farmer"),
    SHOP_MANAGER("Shop Manager"),
    FACTORY_MANAGER("Factory Manager"),
    MCB_STAFF("Milk Collection Booth Staff"),
    DELIVERY_STAFF("Delivery Staff"),
    DAIRY_STAFF("Dairy Staff");

    private final String displayName;

    RoleName(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }

    public RoleType getRoleType() {
        if (this == SYSTEM_ADMIN) {
            return RoleType.SYSTEM;
        } else if (this == TENANT_ADMIN) {
            return RoleType.TENANT;
        } else {
            return RoleType.COMPANY;
        }
    }

    /**
     * Checks if this role is a global role (not tied to any specific module).
     * 
     * @return true if this is a global role, false otherwise
     */
    public boolean isGlobalRole() {
        return this == SYSTEM_ADMIN ||
                this == TENANT_ADMIN ||
                this == COMPANY_ADMIN ||
                this == SUPPLIER ||
                this == CUSTOMER;
    }
}