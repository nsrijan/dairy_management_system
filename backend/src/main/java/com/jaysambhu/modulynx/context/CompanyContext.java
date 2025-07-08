package com.jaysambhu.modulynx.context;

/**
 * Utility class to store and retrieve the current company ID for
 * company-specific
 * operations.
 * Uses ThreadLocal to ensure thread safety.
 */
public class CompanyContext {

    private static final ThreadLocal<Long> CURRENT_COMPANY = new ThreadLocal<>();

    private CompanyContext() {
        // Private constructor to prevent instantiation
    }

    /**
     * Set the current company ID for this thread.
     *
     * @param companyId The company ID to set
     */
    public static void set(Long companyId) {
        CURRENT_COMPANY.set(companyId);
    }

    /**
     * Get the current company ID for this thread.
     *
     * @return The current company ID, or null if not set
     */
    public static Long get() {
        return CURRENT_COMPANY.get();
    }

    /**
     * Check if a company context is set for this thread.
     *
     * @return true if company context is set, false otherwise
     */
    public static boolean isSet() {
        return CURRENT_COMPANY.get() != null;
    }

    /**
     * Clear the current company ID from this thread.
     * Should be called when processing is complete to prevent memory leaks.
     */
    public static void clear() {
        CURRENT_COMPANY.remove();
    }
}