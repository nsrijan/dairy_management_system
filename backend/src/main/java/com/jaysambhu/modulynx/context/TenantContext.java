package com.jaysambhu.modulynx.context;

/**
 * Utility class to store and retrieve the current tenant ID for multi-tenancy
 * support.
 * Uses ThreadLocal to ensure thread safety.
 */
public class TenantContext {

    private static final ThreadLocal<Long> CURRENT_TENANT = new ThreadLocal<>();

    /**
     * Special value to indicate super admin context (no tenant scoping)
     */
    public static final Long SUPER_ADMIN_CONTEXT = -1L;

    private TenantContext() {
        // Private constructor to prevent instantiation
    }

    /**
     * Set the current tenant ID for this thread.
     *
     * @param tenantId The tenant ID to set
     */
    public static void setCurrentTenant(Long tenantId) {
        CURRENT_TENANT.set(tenantId);
    }

    /**
     * Get the current tenant ID for this thread.
     *
     * @return The current tenant ID, or null if not set
     */
    public static Long getCurrentTenant() {
        return CURRENT_TENANT.get();
    }

    /**
     * Check if the current context is for super admin (no tenant scoping)
     *
     * @return true if super admin context, false otherwise
     */
    public static boolean isSuperAdmin() {
        Long currentTenant = getCurrentTenant();
        return currentTenant != null && currentTenant.equals(SUPER_ADMIN_CONTEXT);
    }

    /**
     * Clear the current tenant ID from this thread.
     * Should be called when processing is complete to prevent memory leaks.
     */
    public static void clear() {
        CURRENT_TENANT.remove();
    }
}