package com.jaysambhu.modulynx.core.auth.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Collectors;

/**
 * Service for JWT token operations, including generation, validation, and
 * parsing.
 */
@Service
public class JwtService {

    @Value("${jwt.secret}")
    private String secretKey;

    @Value("${jwt.expiration}")
    private long jwtExpiration;

    /**
     * Extract the username from a JWT token
     *
     * @param token The JWT token
     * @return The username
     */
    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    /**
     * Extract the tenant ID from a JWT token
     *
     * @param token The JWT token
     * @return The tenant ID
     */
    public Long extractTenantId(String token) {
        return Long.valueOf(extractClaim(token, claims -> claims.get("tenantId", String.class)));
    }

    /**
     * Extract the user ID from a JWT token
     *
     * @param token The JWT token
     * @return The user ID
     */
    public Long extractUserId(String token) {
        return Long.valueOf(extractClaim(token, claims -> claims.get("userId", String.class)));
    }

    /**
     * Extract the roles from a JWT token
     *
     * @param token The JWT token
     * @return List of roles
     */
    @SuppressWarnings("unchecked")
    public List<String> extractRoles(String token) {
        return extractClaim(token, claims -> claims.get("roles", List.class));
    }

    /**
     * Extract the permissions from a JWT token
     *
     * @param token The JWT token
     * @return List of permissions
     */
    @SuppressWarnings("unchecked")
    public List<String> extractPermissions(String token) {
        return extractClaim(token, claims -> claims.get("permissions", List.class));
    }

    /**
     * Extract the accessible company IDs from a JWT token
     *
     * @param token The JWT token
     * @return List of accessible company IDs
     */
    @SuppressWarnings("unchecked")
    public List<Long> extractAccessibleCompanyIds(String token) {
        List<String> companyIdStrings = extractClaim(token, claims -> claims.get("accessibleCompanyIds", List.class));
        if (companyIdStrings == null) {
            return new ArrayList<>();
        }
        return companyIdStrings.stream()
                .map(Long::valueOf)
                .collect(Collectors.toList());
    }

    /**
     * Generate a token for a user with no extra claims
     *
     * @param userDetails The user details
     * @return The generated JWT token
     */
    public String generateToken(UserDetails userDetails) {
        return generateToken(new HashMap<>(), userDetails);
    }

    /**
     * Generate a token for a user with tenant information
     *
     * @param userDetails The user details
     * @param tenantId    The tenant ID
     * @return The generated JWT token
     */
    public String generateToken(UserDetails userDetails, Long tenantId) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("tenantId", tenantId.toString());
        return generateToken(claims, userDetails);
    }

    /**
     * Generate a token for a user with comprehensive information including company
     * access
     *
     * @param userDetails The user details
     * @param userId      The user ID
     * @param tenantId    The tenant ID
     * @param companyIds  The accessible company IDs
     * @return The generated JWT token
     */
    public String generateToken(UserDetails userDetails, Long userId, Long tenantId, Set<Long> companyIds) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("userId", userId.toString());
        claims.put("tenantId", tenantId.toString());

        // Extract roles and permissions from authorities
        List<String> roles = extractRolesFromAuthorities(userDetails.getAuthorities());
        List<String> permissions = extractPermissionsFromAuthorities(userDetails.getAuthorities());

        claims.put("roles", roles);
        claims.put("permissions", permissions);

        // Add accessible company IDs as string list for JSON compatibility
        List<String> companyIdStrings = companyIds.stream()
                .map(String::valueOf)
                .collect(Collectors.toList());
        claims.put("accessibleCompanyIds", companyIdStrings);

        return generateToken(claims, userDetails);
    }

    /**
     * Generate a token for a user with comprehensive information
     *
     * @param userDetails The user details
     * @param userId      The user ID
     * @param tenantId    The tenant ID
     * @return The generated JWT token
     */
    public String generateToken(UserDetails userDetails, Long userId, Long tenantId) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("userId", userId.toString());
        claims.put("tenantId", tenantId.toString());

        // Extract roles and permissions from authorities
        List<String> roles = extractRolesFromAuthorities(userDetails.getAuthorities());
        List<String> permissions = extractPermissionsFromAuthorities(userDetails.getAuthorities());

        claims.put("roles", roles);
        claims.put("permissions", permissions);

        return generateToken(claims, userDetails);
    }

    /**
     * Check if a token is valid for a user
     *
     * @param token       The JWT token
     * @param userDetails The user details
     * @return True if the token is valid, false otherwise
     */
    public boolean isTokenValid(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }

    /**
     * Extract a specific claim from a token
     *
     * @param token          The JWT token
     * @param claimsResolver The function to extract the desired claim
     * @return The extracted claim
     */
    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    /**
     * Generate a token with custom claims
     *
     * @param extraClaims The custom claims
     * @param userDetails The user details
     * @return The generated JWT token
     */
    private String generateToken(Map<String, Object> extraClaims, UserDetails userDetails) {
        return Jwts
                .builder()
                .setClaims(extraClaims)
                .setSubject(userDetails.getUsername())
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + jwtExpiration))
                .signWith(getSignInKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    /**
     * Check if a token is expired
     *
     * @param token The JWT token
     * @return True if the token is expired, false otherwise
     */
    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    /**
     * Extract the expiration date from a token
     *
     * @param token The JWT token
     * @return The expiration date
     */
    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    /**
     * Extract all claims from a token
     *
     * @param token The JWT token
     * @return All claims
     */
    private Claims extractAllClaims(String token) {
        return Jwts
                .parserBuilder()
                .setSigningKey(getSignInKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    /**
     * Get the signing key for JWT tokens
     *
     * @return The signing key
     */
    private Key getSignInKey() {
        byte[] keyBytes = Decoders.BASE64.decode(secretKey);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    /**
     * Extract role authorities from the collection of GrantedAuthority objects
     * 
     * @param authorities The collection of GrantedAuthority objects
     * @return List of role names
     */
    private List<String> extractRolesFromAuthorities(Collection<? extends GrantedAuthority> authorities) {
        return authorities.stream()
                .map(GrantedAuthority::getAuthority)
                .filter(authority -> authority.startsWith("ROLE_"))
                .collect(Collectors.toList());
    }

    /**
     * Extract permission authorities from the collection of GrantedAuthority
     * objects
     * 
     * @param authorities The collection of GrantedAuthority objects
     * @return List of permission names
     */
    private List<String> extractPermissionsFromAuthorities(Collection<? extends GrantedAuthority> authorities) {
        return authorities.stream()
                .map(GrantedAuthority::getAuthority)
                .filter(authority -> authority.startsWith("PERMISSION_"))
                .collect(Collectors.toList());
    }
}