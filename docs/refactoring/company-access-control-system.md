# Company Access Control System

## Overview

This document describes the comprehensive company-level access control system implemented to secure company-specific resources and operations. The system provides fine-grained access control based on JWT claims and automatic context management.

## System Architecture

### Components

1. **CompanyContext** - ThreadLocal context management
2. **JWT Enhancement** - Company access claims in tokens
3. **CompanyContextFilter** - Request validation and context setting
4. **Service Layer Integration** - CompanyContext usage in business logic
5. **Repository Layer** - Data access with company scoping

---

## Part 1: JWT Enhancement

### JWT Claims Structure

The JWT token now includes company access control:

```json
{
  "sub": "username",
  "userId": "123",
  "tenantId": "456",
  "roles": ["ROLE_USER", "ROLE_ADMIN"],
  "permissions": ["PERMISSION_READ", "PERMISSION_WRITE"],
  "accessibleCompanyIds": ["1", "2", "3"]
}
```

### Updated Components

- **JwtService**: Added `extractAccessibleCompanyIds()` and enhanced `generateToken()` methods
- **AuthServiceImpl**: Login process now includes company IDs in JWT tokens

---

## Part 2: CompanyContext Class

### Purpose
ThreadLocal storage for current company context, similar to TenantContext.

### API
```java
public class CompanyContext {
    public static void set(Long companyId)      // Set company context
    public static Long get()                    // Get current company ID
    public static boolean isSet()               // Check if context is set
    public static void clear()                  // Clear context (prevent leaks)
}
```

### Thread Safety
- Uses ThreadLocal for thread-safe isolation
- Automatic cleanup prevents memory leaks
- Context is request-scoped

---

## Part 3: CompanyContextFilter

### Purpose
Secures company-specific endpoints with automatic access validation.

### URL Pattern
- **Target**: `/api/v1/companies/{companyId}/...`
- **Method**: Regex pattern matching
- **Order**: Runs after JWT authentication (Order 3)

### Security Flow

1. **Extract Company ID** from URL path
2. **Validate JWT Token** from Authorization header
3. **Extract Accessible Companies** from JWT claims
4. **Validate Access** - Check if user can access requested company
5. **Set Context** - `CompanyContext.set(companyId)` if valid
6. **Return 403** if access denied
7. **Always Clear** context in finally block

### Response Format
```json
{
  "success": false,
  "message": "Access denied to company 123",
  "data": null
}
```

---

## Part 4: Service Layer Usage

### CompanyService Examples

#### Getting Current Company Data
```java
@Override
@Transactional(readOnly = true)
public CompanyDto getCurrentCompanyData() {
    Long companyId = CompanyContext.get();
    
    if (companyId == null) {
        throw new BadRequestException("No company context found");
    }
    
    Company company = findCompanyById(companyId)
            .orElseThrow(() -> new CompanyNotFoundException(companyId));
    
    return mapToDto(company);
}
```

#### Creating Company-Specific Resources
```java
@Override
@Transactional
public Object createCompanyResource(Object resourceData) {
    Long companyId = CompanyContext.get();
    
    // Validate company context
    if (companyId == null) {
        throw new BadRequestException("No company context found");
    }
    
    // Create resource scoped to company
    return createResource(companyId, resourceData);
}
```

#### Company Metrics
```java
@Override
@Transactional(readOnly = true)
public Object getCompanyMetrics() {
    Long companyId = CompanyContext.get();
    
    // Get company-specific metrics
    return buildMetrics(companyId);
}
```

---

## Part 5: Unified Controller Implementation

### Consolidated CompanyController

**Why Consolidation?**
- Eliminated redundancy between multiple company controllers
- Single controller handles both tenant-scoped and company-specific operations
- Cleaner architecture with logical separation of concerns

### Controller Structure

```java
@RestController
@RequestMapping("/api/v1/companies")
public class CompanyController {
    
    // ============ TENANT-SCOPED OPERATIONS ============
    // Work across all companies for the current tenant
    
    @GetMapping                           // GET /api/v1/companies
    @GetMapping("/pageable")              // GET /api/v1/companies/pageable
    @GetMapping("/{id}")                  // GET /api/v1/companies/{id}
    @GetMapping("/search")                // GET /api/v1/companies/search
    
    // ============ COMPANY-SPECIFIC OPERATIONS ============
    // Scoped to specific company, secured by CompanyContextFilter
    
    @GetMapping("/{companyId}/data")      // GET /api/v1/companies/{companyId}/data
    @PostMapping("/{companyId}/resources") // POST /api/v1/companies/{companyId}/resources
    @GetMapping("/{companyId}/metrics")   // GET /api/v1/companies/{companyId}/metrics
    @PutMapping("/{companyId}/settings")  // PUT /api/v1/companies/{companyId}/settings
}
```

### Remaining Controllers

1. **CompanyController** - Unified controller for all company operations
2. **CompanyAdminController** - System admin operations (`/api/v1/admin/companies`)

### URL Pattern Logic

- **Tenant-scoped**: `/api/v1/companies` (no company ID) - Lists/searches companies
- **Company-specific**: `/api/v1/companies/{companyId}/...` - Operations on specific company
- **Admin**: `/api/v1/admin/companies` - System admin operations

### Security Flow

1. **CompanyContextFilter** only processes URLs matching `/api/v1/companies/{companyId}/...`
2. **Tenant-scoped endpoints** bypass company filtering (no company ID in path)
3. **Company-specific endpoints** are secured by CompanyContextFilter

### Example Usage

```java
// Tenant-scoped: Get all companies for current tenant
@GetMapping
public ResponseEntity<List<CompanyDto>> getAllCompanies() {
    // Uses TenantContext for tenant filtering
    return companyService.getCompaniesByTenant();
}

// Company-specific: Get data for specific company
@GetMapping("/{companyId}/data")  
public ResponseEntity<CompanyDto> getCompanyData(@PathVariable Long companyId) {
    // CompanyContextFilter validates access and sets CompanyContext
    // Service uses CompanyContext.get() for company ID
    return companyService.getCurrentCompanyData();
}
```

---

## Part 6: Repository Layer

### Usage Patterns

#### Standard Repository Calls
```java
// In service layer
Long companyId = CompanyContext.get();
List<Resource> resources = resourceRepository.findByCompanyId(companyId);
```

#### Custom Queries with Company Context
```java
@Query("SELECT r FROM Resource r WHERE r.company.id = :companyId")
List<Resource> findByCompanyIdForCurrentCompany(@Param("companyId") Long companyId);
```

#### Service Layer Integration
```java
public List<ResourceDto> getCompanyResources() {
    Long companyId = CompanyContext.get();
    return resourceRepository.findByCompanyId(companyId)
            .stream()
            .map(this::mapToDto)
            .collect(Collectors.toList());
}
```

---

## Security Features

### Access Control
- **JWT-based validation** - Company access embedded in tokens
- **Path-level security** - Company ID validation from URL
- **Automatic context management** - No manual context handling needed
- **Memory leak prevention** - Automatic ThreadLocal cleanup

### Error Handling
- **403 Forbidden** for unauthorized company access
- **400 Bad Request** for invalid company ID format
- **Clear error messages** for debugging

### Performance
- **Minimal overhead** - Only processes company-specific endpoints
- **Efficient validation** - Single JWT claim lookup
- **Thread-safe** - ThreadLocal isolation

---

## Testing

### Unit Tests
```java
@Test
public void testCompanyAccessValidation() {
    // Mock JWT with company access
    List<Long> accessibleCompanies = Arrays.asList(1L, 2L, 3L);
    when(jwtService.extractAccessibleCompanyIds(jwt)).thenReturn(accessibleCompanies);
    
    // Test valid access
    // Test invalid access
    // Test context setting
}
```

### Integration Tests
```java
@Test
public void testCompanyEndpointAccess() {
    // Test with valid company access
    // Test with invalid company access
    // Test context propagation
}
```

---

## Best Practices

### Service Layer
1. **Always check context** - Validate CompanyContext.get() is not null
2. **Use transactions** - Ensure data consistency
3. **Clear error messages** - Help with debugging
4. **Log context usage** - Track company-specific operations

### Repository Layer
1. **Use CompanyContext in services** - Don't pass company ID as parameters
2. **Leverage existing methods** - Use standard repository methods with context
3. **Create company-specific queries** - When business logic requires it

### Controller Layer
1. **Trust the filter** - CompanyContextFilter handles validation
2. **Use context directly** - CompanyContext.get() for business logic
3. **Consistent error handling** - GlobalApiResponse format

---

## Configuration

### Filter Order
```java
@Component
@Order(3) // After TenantFilter (1) and JwtAuthenticationFilter (2)
public class CompanyContextFilter implements Filter
```

### URL Patterns
```java
// Matches: /api/v1/companies/{companyId}/...
private static final Pattern COMPANY_PATH_PATTERN = 
    Pattern.compile("/api/v1/companies/(\\d+)(/.*)?");
```

---

## Troubleshooting

### Common Issues

1. **"No company context found"**
   - Ensure endpoint matches `/api/v1/companies/{companyId}/...` pattern
   - Check JWT token contains accessibleCompanyIds claim

2. **"Access denied to company X"**
   - Verify user has access to requested company
   - Check JWT token company claims

3. **Context not cleared**
   - Filter always clears context in finally block
   - Check for custom ThreadLocal usage

### Debug Endpoints
- `GET /api/v1/companies/{companyId}/context-info` - Shows context state
- Enable DEBUG logging for CompanyContextFilter
- Check JWT token claims with JWT debugger

---

## Future Enhancements

1. **Caching** - Cache company access validation
2. **Audit Logging** - Track company access patterns
3. **Rate Limiting** - Per-company rate limits
4. **Metrics** - Company-specific performance metrics
5. **Admin Override** - Super admin bypass for company restrictions

---

## Summary

The Company Access Control System provides:

- ✅ **Secure company isolation** with JWT-based access control
- ✅ **Automatic context management** with ThreadLocal storage
- ✅ **Easy service integration** with CompanyContext API
- ✅ **Fine-grained security** at the endpoint level
- ✅ **Memory leak prevention** with automatic cleanup
- ✅ **Clear error handling** with consistent response format

This system ensures that users can only access company data they're authorized for, while providing a clean and easy-to-use API for developers. 