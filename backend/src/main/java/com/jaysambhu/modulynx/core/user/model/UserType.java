package com.jaysambhu.modulynx.core.user.model;

/**
 * Enum representing the types of users in the system.
 */
public enum UserType {
    /**
     * System or tenant staff.
     */
    INTERNAL("Internal"),

    /**
     * External user who provides goods or services.
     */
    SUPPLIER("Supplier"),

    /**
     * External user who purchases products.
     */
    CUSTOMER("Customer");

    private final String displayName;

    UserType(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}