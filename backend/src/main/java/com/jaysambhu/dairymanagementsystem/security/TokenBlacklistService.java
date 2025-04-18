package com.jaysambhu.dairymanagementsystem.security;

import org.springframework.stereotype.Service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;

import java.security.Key;
import java.util.Date;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
@RequiredArgsConstructor
public class TokenBlacklistService {

    private final Map<String, Date> blacklistedTokens = new ConcurrentHashMap<>();

    @Value("${jwt.secret}")
    private String secretKey;

    private final JwtService jwtService;

    /**
     * Add a token to the blacklist
     * 
     * @param token the JWT token to blacklist
     * @return true if the token was added to the blacklist, false if it was already
     *         expired or blacklisted
     */
    public boolean blacklistToken(String token) {
        try {
            // Extract the expiration date
            Date expiration = extractExpiration(token);

            // Only blacklist if the token is not expired yet
            if (expiration != null && expiration.after(new Date())) {
                blacklistedTokens.put(token, expiration);
                return true;
            }
            return false;
        } catch (Exception e) {
            // If token is malformed or can't be parsed, just ignore it
            return false;
        }
    }

    /**
     * Check if a token is blacklisted
     * 
     * @param token the token to check
     * @return true if the token is blacklisted, false otherwise
     */
    public boolean isBlacklisted(String token) {
        return blacklistedTokens.containsKey(token);
    }

    /**
     * Clean up expired tokens from the blacklist every hour
     */
    @Scheduled(fixedRate = 3600000) // Run every hour
    public void cleanupExpiredTokens() {
        Date now = new Date();
        blacklistedTokens.entrySet().removeIf(entry -> entry.getValue().before(now));
    }

    private Date extractExpiration(String token) {
        try {
            Claims claims = Jwts
                    .parserBuilder()
                    .setSigningKey(getSignInKey())
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
            return claims.getExpiration();
        } catch (Exception e) {
            return null;
        }
    }

    private Key getSignInKey() {
        byte[] keyBytes = Decoders.BASE64.decode(secretKey);
        return Keys.hmacShaKeyFor(keyBytes);
    }
}