# Subdomain-Based Login Refactoring

## Overview

The login system has been refactored to strictly enforce subdomain-based access control. This ensures that users can only access their designated domains and prevents unauthorized cross-domain access.

## Key Changes

### 1. Subdomain Resolution
- **Admin Domain**: `admin.localhost` or `localhost` → Sets `SUPER_ADMIN_CONTEXT` (-1L)
- **Tenant Domains**: `{tenantCode}.localhost` → Resolves to actual tenant ID

### 2. User Authentication Logic

#### Admin Domain Access (`admin.localhost` or `localhost`)
- Only allows users with `SYSTEM_ADMIN` role
- Bypasses tenant scoping
- Uses `UserRepository.findSystemAdminByUsernameOrEmail()`
- JWT token contains `tenantId: -1` (SUPER_ADMIN_CONTEXT)

#### Tenant Domain Access (`{tenantCode}.localhost`)
- Only allows users belonging to the specific tenant
- Enforces tenant scoping via `UserRepository.findFirstByUsernameOrEmailAndPrimaryTenantId()`
- Prevents system admins from logging in via tenant subdomains
- JWT token contains the actual tenant ID

### 3. Security Validations

1. **Cross-Domain Prevention**: System admins cannot login from tenant subdomains
2. **Tenant Isolation**: Users can only login from their assigned tenant domain
3. **Credential Validation**: Manual password validation using `PasswordEncoder`
4. **Account Status**: Verifies user account is active

## New Repository Methods

```java
// Find user by username/email scoped to specific tenant
Optional<User> findFirstByUsernameOrEmailAndPrimaryTenantId(String usernameOrEmail, Long tenantId);

// Find system admin users
Optional<User> findSystemAdminByUsernameOrEmail(String usernameOrEmail);
```

## Configuration Updates

### application.yml
```yaml
app:
  domain: localhost
  development-mode: true
  tenant:
    default: system
    reserved: www,admin,api,auth,mail,blog,docs,status
```

### Development Mode
- Enabled for local testing
- Supports `X-Tenant-Subdomain` header for subdomain simulation
- Special handling for `admin` subdomain

## Usage Examples

### Admin Login
```bash
# Via localhost (main domain)
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"usernameOrEmail": "admin", "password": "admin@123"}'

# Via admin subdomain
curl -X POST http://admin.localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"usernameOrEmail": "admin", "password": "admin@123"}'

# Via X-Tenant-Subdomain header (development)
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -H "X-Tenant-Subdomain: admin" \
  -d '{"usernameOrEmail": "admin", "password": "admin@123"}'
```

### Tenant User Login
```bash
# Via tenant subdomain
curl -X POST http://tenant1.localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"usernameOrEmail": "user@tenant1.com", "password": "password123"}'

# Via X-Tenant-Subdomain header (development)
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -H "X-Tenant-Subdomain: tenant1" \
  -d '{"usernameOrEmail": "user@tenant1.com", "password": "password123"}'
```

## JWT Token Structure

### Admin Token
```json
{
  "sub": "admin",
  "userId": "1",
  "tenantId": "-1",
  "roles": ["ROLE_SYSTEM_ADMIN"],
  "permissions": ["PERMISSION_ADMIN_ALL"],
  "iat": 1234567890,
  "exp": 1234654290
}
```

### Tenant User Token
```json
{
  "sub": "user@tenant1.com",
  "userId": "5",
  "tenantId": "2",
  "roles": ["ROLE_TENANT_USER"],
  "permissions": ["PERMISSION_USER_READ", "PERMISSION_USER_WRITE"],
  "iat": 1234567890,
  "exp": 1234654290
}
```

## Error Handling

### Common Error Messages
- `"Admin credentials not found or user is not a system administrator"` - Non-admin trying to access admin domain
- `"User not found in this tenant"` - User doesn't exist in the specified tenant
- `"Invalid credentials"` - Wrong password
- `"Account is inactive"` - User account is disabled
- `"Access denied: User not authorized for this tenant"` - User trying to access wrong tenant
- `"System administrators cannot login from tenant subdomains"` - Admin trying to access tenant domain

## Testing

### Local Development Setup
1. Add entries to your hosts file:
   ```
   127.0.0.1 admin.localhost
   127.0.0.1 tenant1.localhost
   127.0.0.1 tenant2.localhost
   ```

2. Test admin access:
   - `http://admin.localhost:8080/login`
   - `http://localhost:8080/login`

3. Test tenant access:
   - `http://tenant1.localhost:8080/login`
   - `http://tenant2.localhost:8080/login`

### Unit Tests
Run the subdomain login tests:
```bash
mvn test -Dtest=SubdomainLoginTest
```

## Benefits

1. **Enhanced Security**: Strict domain-based access control
2. **Tenant Isolation**: Complete separation between tenant users
3. **Admin Protection**: System admins can only access via secure admin domain
4. **Flexible Development**: Header-based testing for local development
5. **Clear Separation**: Obvious distinction between admin and tenant access

## Migration Notes

- Existing users will need to access their appropriate subdomains
- System admins must use `admin.localhost` or `localhost` for access
- Tenant users must use their specific tenant subdomain
- All existing JWT tokens remain valid but will be validated against the new rules

## Future Enhancements

1. **Production Domain Support**: Easy migration to production domains
2. **Multi-Domain Tenants**: Support for custom tenant domains
3. **SSO Integration**: Single sign-on with subdomain awareness
4. **Audit Logging**: Track cross-domain access attempts
5. **Rate Limiting**: Per-subdomain request throttling 