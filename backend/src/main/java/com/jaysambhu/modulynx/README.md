# Modulynx - Multi-Domain SaaS Platform

This is the core package for the Modulynx platform, a multi-tenant SaaS application supporting multiple business domains.

## Architecture Overview

The platform follows a module-based architecture with features:

```
com.jaysambhu.modulynx/
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

## Core vs. Modules

- **Core**: Essential system functionality shared across all business domains
- **Modules**: Business domain-specific functionality and features
- **Common**: Shared utilities and helper classes used by all parts of the system
- **Config**: Configuration classes for the application
- **Context**: Context management for features like multi-tenancy

## Multi-Tenancy

The system implements multi-tenancy at its core:
- Tenants are identified via subdomains
- Each tenant's data is isolated
- Tenants can have access to different business modules

## Module-Based Design

This architecture allows:
1. **Extensibility**: New business domains can be added without modifying existing code
2. **Maintainability**: Related code is grouped together
3. **Reusability**: Core functionality serves all business domains
4. **Isolation**: Each module can evolve independently

## Feature Toggling

The architecture supports feature toggling at multiple levels:
1. **Business Domain Level**: Enable/disable entire business domains per tenant
2. **Feature Level**: Enable/disable specific features within a domain
3. **Function Level**: Enable/disable specific functions within a feature

## Contributing

When contributing to this codebase:

1. Core functionality belongs in the appropriate core module
2. Business-specific functionality belongs in a domain module under features
3. Follow the established package and class naming conventions
4. Write unit tests for all new functionality
5. Update documentation when adding or changing features 