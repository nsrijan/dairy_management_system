# Module-Based Architecture with Features

## Overview

The Dairy Management System has been restructured into a module-based architecture with features to support multiple business domains (like dairy, pottery, garments) within a multi-tenant SaaS system. This architecture organizes code by business domains (modules) with domain-specific features inside each module. This document outlines the new structure, its benefits, and implementation details.

## Architecture Structure

The application is now organized into these main components:

```
backend/src/main/java/com/jaysambhu/dairymanagementsystem/
├── core/                           # Core functionality shared across all domains
│   ├── user/                       # User management
│   ├── auth/                       # Authentication and authorization
│   ├── tenant/                     # Multi-tenant management
│   ├── company/                    # Company management
│   ├── subscription/               # Subscription management
│   ├── audit/                      # Audit logging functionality
│   └── feature-toggle/             # Feature flags and toggles
├── modules/                        # Business domain modules
│   ├── dairy/                      # Dairy industry module
│   │   ├── features/               # Features within dairy module
│   │   │   ├── milkcollection/     # Milk collection functionality
│   │   │   ├── production/         # Dairy production processes
│   │   │   └── inventory/          # Dairy inventory management
│   ├── pottery/                    # Pottery industry module
│   │   └── features/               # Features within pottery module
│   └── garments/                   # Garments industry module
│       └── features/               # Features within garments module
├── common/                         # Shared utilities, exceptions, helpers
├── config/                         # Application-wide configuration
└── context/                        # Context management (e.g., TenantContext)
```

## Core vs. Modules vs. Features

### Core
The `core` folder contains essential system functionality that is shared across all business domains:

- **User:** User management, profiles, and preferences
- **Auth:** Authentication, JWT handling, permissions
- **Tenant:** Multi-tenant support, tenant resolution, isolation
- **Company:** Company management within each tenant
- **Subscription:** Subscription plans and billing
- **Audit:** System-wide audit logging
- **Feature-toggle:** Dynamic feature enabling/disabling per tenant

### Modules
The `modules` folder contains top-level business domains or verticals:

- **Dairy:** Module for dairy business operations
- **Pottery:** Module for pottery business operations
- **Garments:** Module for garment manufacturing operations

### Features
Within each module, the `features` folder organizes domain-specific functionality:

- **Dairy Module Features:**
  - Milk collection
  - Dairy production
  - Curd/cheese processing
  - Dairy inventory
  
- **Pottery Module Features:** (Placeholder)
  - Raw materials
  - Production
  - Kiln management
  
- **Garments Module Features:** (Placeholder)
  - Fabric inventory
  - Cutting/sewing tracking
  - Garment production

## Internal Structure Pattern

Each module follows a consistent internal structure:

```
modules/dairy/
├── features/         # Domain-specific features
│   ├── milkcollection/
│   │   ├── controller/  # REST endpoints for milk collection
│   │   ├── service/     # Business logic implementation
│   │   ├── repository/  # Data access layer
│   │   ├── model/       # Domain entities
│   │   ├── dto/         # Data transfer objects
│   │   └── exception/   # Feature-specific exceptions
│   ├── production/
│   └── inventory/
├── common/           # Common utilities for this module
├── config/           # Module-specific configuration
└── api/              # Module-level API endpoints
```

## Benefits

1. **Separation of Concerns:** Clear distinction between core platform, business domain modules, and features
2. **Hierarchical Organization:** Logical grouping from domains (modules) down to specific features
3. **Extensibility:** New business domains can be added without modifying existing code
4. **Maintainability:** Related code is grouped together, making maintenance easier
5. **Reusability:** Core functionality serves all business domains
6. **Scalability:** Modules and features can be developed and scaled independently
7. **Tenant Customization:** Features can be enabled/disabled per tenant
8. **Team Organization:** Development teams can be organized around modules or features
9. **Onboarding:** New developers can more easily understand the system architecture

## Multi-Tenant Considerations

The restructured architecture maintains the same multi-tenant capabilities:

- Tenant context is preserved and used across all modules
- Both core and feature modules respect tenant isolation
- API contracts for tenant identification remain unchanged
- JWT handling continues to include tenant information

## Feature Toggling

The new structure facilitates feature toggling at multiple levels:

1. **Business Domain Level:** Enable/disable entire business domains per tenant
2. **Feature Level:** Enable/disable specific features within a domain
3. **Function Level:** Enable/disable specific functions within a feature

## Implementation Guidelines

When implementing new features:

1. Determine if the feature belongs in core or in a specific business domain
2. Create the feature in the appropriate location following the established structure
3. Use dependency injection to access core services from feature modules
4. Implement proper security and tenant isolation
5. Add feature toggle capability if the feature should be selectively enabled
6. Update API documentation to reflect the new endpoints

## Extending to New Business Domains

To add a new business domain:

1. Create a new folder under `modules/` for the domain
2. Set up the module structure with a `features/` subfolder
3. Implement the standard internal structure for each feature
4. Develop the domain-specific features
5. Add appropriate feature toggles
6. Update documentation

## Migration Strategy

Existing code should be migrated to the new structure gradually:

1. Move core modules first
2. Create the dairy module with features subfolder
3. Move dairy-specific features into the appropriate structure
4. Update import statements and dependency injection
5. Thoroughly test to ensure functionality is preserved
6. Implement new features using the new structure 