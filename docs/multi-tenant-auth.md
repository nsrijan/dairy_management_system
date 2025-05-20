# Multi-Tenant Authentication in Dairy Management System

## Overview

The Dairy Management System uses a multi-tenant architecture with subdomain-based tenant resolution. This document explains the authentication and authorization mechanisms for both super admin and tenant-specific users.

## Tenant Resolution

### How Tenants Are Identified

- **Main Domain (dms.com)**: Used by super admin, bypasses tenant scoping
- **Subdomains (tenant.dms.com)**: Used by tenant-specific users, automatically resolves to the correct tenant

### Technical Implementation

The system resolves tenants based on the domain/subdomain of the request:

1. `SubdomainTenantResolver` extracts the subdomain from the request host
2. The resolver identifies whether the request is from the main domain or a tenant subdomain
3. For the main domain, it sets a special `SUPER_ADMIN_CONTEXT` to bypass tenant scoping
4. For subdomains, it looks up the tenant by its slug (the subdomain name)
5. The tenant ID is stored in a ThreadLocal variable via `TenantContext`

## Authentication Flow

### Super Admin Authentication

1. Super admin logs in through the main domain (dms.com)
2. Tenant scoping is bypassed, allowing access to all tenants
3. The system sets `TenantContext.SUPER_ADMIN_CONTEXT` for these requests

### Tenant-Specific Authentication

1. Tenant users log in through their tenant subdomain (tenant.dms.com)
2. The system automatically identifies the tenant from the subdomain
3. Tenant ID is stored in the JWT token and in `TenantContext`
4. All operations are scoped to the user's tenant

## Local Development Testing

For local development, you can test tenant resolution with:

1. **For Super Admin**: Use `localhost:8080`
2. **For Tenant Users**: Use `tenant.localhost:8080` (requires hosts file configuration)

Example hosts file configuration:
```
127.0.0.1 localhost
127.0.0.1 test.localhost
```

## Security Considerations

1. **Tenant Isolation**: Data is isolated by tenant ID, enforced at the service layer
2. **JWT Claims**: JWT tokens include the tenant ID to maintain tenant context across requests
3. **ThreadLocal Cleanup**: TenantContext is cleared after each request to prevent memory leaks
4. **Permission Checks**: Permissions are checked against the user's roles within their tenant

## Implementing Tenant-Aware Services

Services that need to respect tenant boundaries should:

1. Extend `AbstractTenantAwareService`
2. Use the provided tenant-aware methods for data access
3. Access the current tenant context via `TenantContext.getCurrentTenant()`
4. Check super admin status via `TenantContext.isSuperAdmin()`

Example:
```java
// Check if super admin or use tenant filtering
if (TenantContext.isSuperAdmin()) {
    return repository.findAll();
} else {
    Long tenantId = TenantContext.getCurrentTenant();
    return repository.findByTenantId(tenantId);
}
``` 