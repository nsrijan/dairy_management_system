# Business Domain Modules

This directory contains modules for specific business domains, each with its own set of features.

## Modules

- **dairy**: Dairy industry module
  - Features for milk collection, production, inventory management
  
- **pottery**: Pottery industry module (placeholder)
  - Features will include raw materials, production, kiln management
  
- **garments**: Garments industry module (placeholder)
  - Features will include fabric inventory, pattern management, production

## Module Structure

Each business domain module follows this structure:

```
modules/<domain>/
├── features/         # Domain-specific features
│   ├── feature1/
│   │   ├── controller/  # REST endpoints
│   │   ├── service/     # Business logic
│   │   ├── repository/  # Data access
│   │   ├── model/       # Domain entities
│   │   ├── dto/         # Data transfer objects
│   │   └── exception/   # Feature-specific exceptions
│   ├── feature2/
│   └── feature3/
├── common/           # Common utilities for this module
└── config/           # Module-specific configuration
```

## Adding New Modules

To add a new business domain:

1. Create a folder under `modules/` for the domain
2. Create a `features/` subfolder
3. Set up appropriate feature subfolders
4. Implement the domain-specific features 