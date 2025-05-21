package com.jaysambhu.modulynx.core.user.model;

/**
 * Enum representing the available roles in the system.
 */
public enum RoleName {
    // System-level roles
    SYSTEM_ADMIN("System Administrator"),

    // Tenant-level roles
    TENANT_ADMIN("Tenant Administrator"),

    // Company-level roles
    COMPANY_ADMIN("Company Administrator"),
    SUPPLIER("Supplier"),
    FARMER("Farmer"),
    SHOP_MANAGER("Shop Manager"),
    FACTORY_MANAGER("Factory Manager"),
    MCB_STAFF("Milk Collection Booth Staff"),
    DELIVERY_STAFF("Delivery Staff"),
    CUSTOMER("Customer");

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
}