package com.jaysambhu.dairymanagementsystem.modules.user.model;

/**
 * Enum representing the level at which a role operates.
 */
public enum RoleType {
    /**
     * System-level roles with platform-wide access.
     */
    SYSTEM,

    /**
     * Tenant-level roles with access to all companies within a tenant.
     */
    TENANT,

    /**
     * Company-level roles with access limited to a specific company.
     */
    COMPANY
}