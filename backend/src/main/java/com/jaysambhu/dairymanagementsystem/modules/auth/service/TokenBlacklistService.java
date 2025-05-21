package com.jaysambhu.dairymanagementsystem.modules.auth.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Date;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Service for managing blacklisted JWT tokens
 */
@Service
@RequiredArgsConstructor
public class TokenBlacklistService {

    private final JwtService jwtService;

    // Thread-safe map to store blacklisted tokens and their expiry
    private final Map<String, Date> blacklistedTokens = new ConcurrentHashMap<>();

    // Frequency to clean up expired tokens (in milliseconds)
    @Value("${jwt.blacklist.cleanup-interval:3600000}")
    private long cleanupInterval;

    private Instant lastCleanup = Instant.now();

    /**
     * Blacklist a token
     *
     * @param token The JWT token to blacklist
     */
    public void blacklist(String token) {
        // Extract the expiration date from the token
        Date expiry = jwtService.extractClaim(token, claims -> claims.getExpiration());
        blacklistedTokens.put(token, expiry);

        // Periodically clean up expired tokens
        cleanupExpiredTokens();
    }

    /**
     * Check if a token is blacklisted
     *
     * @param token The JWT token to check
     * @return True if the token is blacklisted, false otherwise
     */
    public boolean isBlacklisted(String token) {
        return blacklistedTokens.containsKey(token);
    }

    /**
     * Clean up expired tokens from the blacklist
     */
    private void cleanupExpiredTokens() {
        Instant now = Instant.now();

        // Only clean up periodically
        if (now.toEpochMilli() - lastCleanup.toEpochMilli() > cleanupInterval) {
            lastCleanup = now;

            // Remove expired tokens
            Date currentDate = new Date();
            blacklistedTokens.entrySet().removeIf(entry -> entry.getValue().before(currentDate));
        }
    }
}