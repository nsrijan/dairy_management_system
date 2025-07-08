package com.jaysambhu.modulynx.auth;

import com.jaysambhu.modulynx.context.TenantContext;
import com.jaysambhu.modulynx.core.auth.service.impl.AuthServiceImpl;
import com.jaysambhu.modulynx.core.tenant.resolver.SubdomainTenantResolver;
import com.jaysambhu.modulynx.core.user.dto.LoginRequest;
import com.jaysambhu.modulynx.core.user.model.User;
import com.jaysambhu.modulynx.core.user.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

/**
 * Test class for subdomain-based login functionality
 */
@ExtendWith(MockitoExtension.class)
public class SubdomainLoginTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private SubdomainTenantResolver tenantResolver;

    @InjectMocks
    private AuthServiceImpl authService;

    @Test
    public void testAdminSubdomainResolution() {
        // Test admin subdomain resolution
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.setServerName("admin.localhost");

        when(tenantResolver.resolveTenantFromRequest(request)).thenReturn(TenantContext.SUPER_ADMIN_CONTEXT);

        Long resolvedTenantId = tenantResolver.resolveTenantFromRequest(request);

        assertEquals(TenantContext.SUPER_ADMIN_CONTEXT, resolvedTenantId);
        assertTrue(resolvedTenantId.equals(-1L)); // SUPER_ADMIN_CONTEXT is -1L
    }

    @Test
    public void testTenantSubdomainResolution() {
        // Test tenant subdomain resolution
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.setServerName("tenant1.localhost");

        Long expectedTenantId = 1L;
        when(tenantResolver.resolveTenantFromRequest(request)).thenReturn(expectedTenantId);

        Long resolvedTenantId = tenantResolver.resolveTenantFromRequest(request);

        assertEquals(expectedTenantId, resolvedTenantId);
        assertFalse(resolvedTenantId.equals(TenantContext.SUPER_ADMIN_CONTEXT));
    }

    @Test
    public void testMainDomainResolution() {
        // Test main domain resolution
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.setServerName("localhost");

        when(tenantResolver.resolveTenantFromRequest(request)).thenReturn(TenantContext.SUPER_ADMIN_CONTEXT);

        Long resolvedTenantId = tenantResolver.resolveTenantFromRequest(request);

        assertEquals(TenantContext.SUPER_ADMIN_CONTEXT, resolvedTenantId);
    }

    @Test
    public void testHeaderBasedTenantResolution() {
        // Test X-Tenant-Subdomain header resolution
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.setServerName("localhost");
        request.addHeader("X-Tenant-Subdomain", "tenant1");

        Long expectedTenantId = 1L;
        when(tenantResolver.resolveTenantFromRequest(request)).thenReturn(expectedTenantId);

        Long resolvedTenantId = tenantResolver.resolveTenantFromRequest(request);

        assertEquals(expectedTenantId, resolvedTenantId);
    }

    @Test
    public void testAdminHeaderBasedResolution() {
        // Test X-Tenant-Subdomain header with admin value
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.setServerName("localhost");
        request.addHeader("X-Tenant-Subdomain", "admin");

        when(tenantResolver.resolveTenantFromRequest(request)).thenReturn(TenantContext.SUPER_ADMIN_CONTEXT);

        Long resolvedTenantId = tenantResolver.resolveTenantFromRequest(request);

        assertEquals(TenantContext.SUPER_ADMIN_CONTEXT, resolvedTenantId);
    }
}