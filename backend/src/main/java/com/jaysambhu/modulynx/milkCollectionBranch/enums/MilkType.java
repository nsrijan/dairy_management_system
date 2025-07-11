package com.jaysambhu.modulynx.milkCollectionBranch.enums;

/**
 * Enum representing different types of milk
 */
public enum MilkType {
    RAW("Raw Milk"),
    WHOLE("Whole Milk");

    private final String displayName;

    MilkType(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}