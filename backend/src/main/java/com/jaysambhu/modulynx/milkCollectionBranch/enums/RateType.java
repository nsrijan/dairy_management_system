package com.jaysambhu.modulynx.milkCollectionBranch.enums;

/**
 * Enum representing different rate types for milk transactions
 */
public enum RateType {
    BUY("Purchase Rate"),
    SELL("Sale Rate");

    private final String displayName;

    RateType(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}