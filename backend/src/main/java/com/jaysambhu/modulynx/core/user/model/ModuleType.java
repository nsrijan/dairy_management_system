package com.jaysambhu.modulynx.core.user.model;

/**
 * Enum representing the different types of business modules in the system.
 */
public enum ModuleType {
    DAIRY("Dairy Management"),
    POTTERY("Pottery Management"),
    GARMENTS("Garments Management");

    private final String displayName;

    ModuleType(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}