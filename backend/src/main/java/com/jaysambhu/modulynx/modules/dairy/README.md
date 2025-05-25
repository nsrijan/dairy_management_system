# Dairy Module

This module contains features specific to dairy businesses.

## Features

The dairy module is organized into the following main features:

### Milk Collection (`features/milkcollection`)

- Farmer registration and management
- Milk collection center management
- Milk quality testing (fat, SNF, etc.)
- Collection recording and reporting
- Farmer payment calculation

### Production (`features/production`)

- Production batch management
- Dairy product manufacturing
- Process tracking
- Quality control
- Batch traceability

### Inventory (`features/inventory`)

- Raw milk inventory
- Finished product inventory
- Inventory movement tracking
- Expiry date management
- Stock level alerts

## Integration with Core Modules

The dairy module integrates with the following core modules:

- **User Module**: For authentication and authorization
- **Tenant Module**: For multi-tenant support
- **Company Module**: For company-specific operations
- **Subscription Module**: For feature access control

## Tenant-Specific Configuration

Each tenant can configure the dairy module based on their specific requirements:

- Custom product types
- Quality grading parameters
- Collection center settings
- Pricing formulas 