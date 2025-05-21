# Dairy Management System - Architecture Document

## System Architecture Overview

The Dairy Management System is built using a multi-tenant, feature-based architecture that allows multiple dairy organizations to operate independently while sharing the same application infrastructure.

### Key Architectural Principles

1. **Multi-tenancy**: Each client organization is isolated as a separate tenant
2. **Feature-based Organization**: Code is organized by business domain features
3. **Role-based Security**: Access control based on user roles within companies
4. **Auditing**: All changes are tracked for compliance and traceability
5. **REST API Design**: Consistent API design with standard response formats
6. **Modularity**: System is built as interconnected but independent modules

## Technical Stack

- **Language**: Java 17
- **Framework**: Spring Boot 3.x
- **Database**: PostgreSQL 14+
- **ORM**: Hibernate/JPA
- **Migration**: Flyway
- **Security**: Spring Security with JWT
- **Auditing**: Hibernate Envers
- **API Documentation**: SpringDoc OpenAPI (Swagger)
- **Testing**: JUnit 5, Mockito, RestAssured

## Multi-tenancy Implementation

### Tenant Resolution and Isolation

The system uses a subdomain-based approach to identify tenants:
- Each tenant is assigned a unique subdomain (e.g., `client1.dairysystem.com`)
- A `SubdomainTenantResolver` extracts the tenant identifier from the request URL
- The `TenantFilter` establishes the tenant context for each request
- The `TenantContext` uses ThreadLocal storage to maintain the current tenant ID throughout the request lifecycle

### Data Isolation

- Each entity requiring tenant isolation includes a `tenant_id` field
- Repository methods filter by tenant ID using the current context
- Service methods enforce tenant isolation
- Database indexes on tenant_id fields optimize multi-tenant queries

## Module Structure

The application follows a feature-based structure where each business domain has its own module:

```
src/main/java/com/jaysambhu/dairymanagementsystem/
├── common/                     # Shared utilities and base classes
│   ├── audit/                  # Audit configuration
│   ├── exception/              # Exception handling
│   └── response/               # Standardized API responses
├── config/                     # Application-wide configuration
├── context/                    # Context management (e.g., TenantContext)
├── modules/                    # Feature modules
│   ├── tenant/                 # Tenant management module
│   ├── auth/                   # Authentication module
│   ├── user/                   # User management module
│   ├── company/                # Company management module
│   ├── supplier/               # Supplier management module
│   └── ...                     # Other business modules
└── DairyManagementSystemApplication.java
```

Each module follows a consistent internal structure:

```
modules/tenant/
├── controller/                 # REST controllers
│   └── admin/                  # Admin-specific controllers
├── dto/                        # Data Transfer Objects
├── exception/                  # Module-specific exceptions
├── model/                      # Entity classes
├── repository/                 # Data access layer
├── service/                    # Business logic
│   └── impl/                   # Service implementations
└── config/                     # Module-specific configuration
```

## Entity Design

### Base Entity

All entities extend a common `BaseEntity` class that provides:
- Primary key management
- Audit fields (createdAt, createdBy, updatedAt, updatedBy)
- Integration with Hibernate Envers for revision tracking

### Core Entity Relationships

The system is built around these core entities and their relationships:

1. **Tenant**
   - The top-level entity representing a client organization
   - Has many Companies

2. **Company**
   - Represents an organization within a tenant
   - Belongs to one Tenant
   - Has many Users through UserCompanyRole

3. **User**
   - Represents a system user
   - Has one primary Tenant
   - Has many Companies through UserCompanyRole
   - Has many Roles through UserCompanyRole

4. **Role**
   - Represents a system role (e.g., SYSTEM_ADMIN, TENANT_ADMIN, COMPANY_ADMIN)
   - Has many Permissions

5. **UserCompanyRole**
   - Junction entity linking Users, Companies, and Roles
   - Enables multi-role, multi-company assignments

## Security Architecture

### Authentication

The system uses JWT (JSON Web Token) based authentication:
- Tokens include tenant context
- Short expiry with refresh token capability
- Token blacklisting for revocation

### Authorization

Authorization is implemented at multiple levels:
1. **Controller level**: Using `@PreAuthorize` annotations
2. **Method level**: Using `@PreAuthorize` with SpEL expressions
3. **Data level**: Using tenant and company filtering in repositories

### Role Hierarchy

```
- System Level:
  - SYSTEM_ADMIN

- Tenant Level:
  - TENANT_ADMIN

- Company Level:
  - COMPANY_ADMIN
  - SUPPLIER
  - FARMER
  - SHOP_MANAGER
  - FACTORY_MANAGER
  - MCB_STAFF
  - DELIVERY_STAFF
  - CUSTOMER
```

## API Design Principles

1. **Consistent URL Structure**:
   - `/api/v1/{resource}` - Standard endpoints
   - `/api/v1/admin/{resource}` - Admin endpoints

2. **Standard Response Format**:
   ```json
   {
     "success": true,
     "message": "Operation successful",
     "data": { ... },
     "timestamp": "2023-08-15T10:15:30Z"
   }
   ```

3. **Error Handling**:
   - Consistent error responses via GlobalExceptionHandler
   - HTTP status codes aligned with error types
   - Detailed error messages for developers

4. **Pagination**:
   - Standard pagination parameters (page, size, sort)
   - Consistent pagination metadata in responses

## Database Design

### Schema Management

- Flyway manages database migrations
- Version-controlled schema evolution
- Migrations that maintain backward compatibility

### Audit Tables

- Each audited entity has a corresponding `{entity}_aud` table
- Central `revision_info` table tracks all revisions
- Includes user, timestamp, and action information

## Development Guidelines

1. **Coding Standards**:
   - Follow Google Java Style Guide
   - Use Lombok to reduce boilerplate
   - Document public APIs

2. **Testing Strategy**:
   - Unit tests for service and utility classes
   - Integration tests for repositories
   - API tests for controllers
   - Multi-tenant aware test utilities

3. **Branching Strategy**:
   - Feature branches from develop
   - Release branches
   - Hotfix branches when needed

4. **Logging**:
   - Use SLF4J with logback
   - Include tenant context in logs
   - Structured logging for important operations

## Future Scalability Considerations

1. **Horizontal Scaling**:
   - Stateless application design for multiple instances
   - Separate API and background processing

2. **Performance Optimizations**:
   - Tenant-aware caching strategies
   - Query optimization for multi-tenant scenarios
   - Potential for read replicas by tenant

3. **Extensibility**:
   - Plugin architecture for tenant-specific customizations
   - Event-driven design for loose coupling 