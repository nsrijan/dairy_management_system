# Backend Structure - Dairy Management System (Post-Refactoring)

## Overview

After removing the module system, the backend will have a simplified, dairy-focused architecture while maintaining multi-tenancy, company management, and audit capabilities.

## Directory Structure

```
src/main/java/com/jaysambhu/dairysystem/
├── common/                           # Shared utilities and base classes
│   ├── audit/                        # Audit configuration
│   │   ├── config/
│   │   ├── CustomRevisionEntity.java
│   │   └── CustomRevisionListener.java
│   ├── entity/
│   │   └── BaseEntity.java
│   ├── exception/                    # Global exception handling
│   │   ├── BadRequestException.java
│   │   ├── GlobalExceptionHandler.java
│   │   ├── InvalidTenantException.java
│   │   ├── ResourceNotFoundException.java
│   │   └── UnauthorizedException.java
│   ├── response/
│   │   └── GlobalApiResponse.java
│   └── service/
│       └── AbstractTenantAwareService.java
├── config/                           # Application-wide configuration
│   ├── DataSeeder.java
│   └── OpenApiConfig.java
├── context/                          # Context management
│   └── TenantContext.java
├── core/                             # Core functionality
│   ├── auth/                         # Authentication & Authorization
│   │   ├── config/
│   │   ├── controller/
│   │   ├── dto/
│   │   ├── exception/
│   │   ├── filter/
│   │   └── service/
│   ├── tenant/                       # Multi-tenant support
│   │   ├── controller/
│   │   ├── dto/
│   │   ├── model/
│   │   ├── repository/
│   │   ├── service/
│   │   └── resolver/
│   ├── company/                      # Company management
│   │   ├── controller/
│   │   ├── dto/
│   │   ├── model/
│   │   ├── repository/
│   │   └── service/
│   ├── user/                         # User management
│   │   ├── controller/
│   │   │   └── admin/
│   │   ├── dto/
│   │   ├── model/
│   │   ├── repository/
│   │   └── service/
│   └── role/                         # Simplified role system
│       ├── controller/
│       ├── dto/
│       ├── model/
│       ├── repository/
│       └── service/
├── dairy/                            # Dairy business domain
│   ├── milkcollection/               # Milk Collection Branches
│   │   ├── controller/
│   │   ├── dto/
│   │   ├── model/
│   │   ├── repository/
│   │   └── service/
│   ├── farmer/                       # Farmer management
│   │   ├── controller/
│   │   ├── dto/
│   │   ├── model/
│   │   ├── repository/
│   │   └── service/
│   ├── factory/                      # Factory operations
│   │   ├── controller/
│   │   ├── dto/
│   │   ├── model/
│   │   ├── repository/
│   │   └── service/
│   ├── inventory/                    # Inventory management
│   │   ├── controller/
│   │   ├── dto/
│   │   ├── model/
│   │   ├── repository/
│   │   └── service/
│   ├── storage/                      # Storage room management
│   │   ├── controller/
│   │   ├── dto/
│   │   ├── model/
│   │   ├── repository/
│   │   └── service/
│   ├── shop/                         # Retail shop management
│   │   ├── controller/
│   │   ├── dto/
│   │   ├── model/
│   │   ├── repository/
│   │   └── service/
│   ├── product/                      # Product management
│   │   ├── controller/
│   │   ├── dto/
│   │   ├── model/
│   │   ├── repository/
│   │   └── service/
│   └── quality/                      # Quality testing
│       ├── controller/
│       ├── dto/
│       ├── model/
│       ├── repository/
│       └── service/
└── DairySystemApplication.java
```

## Core Entity Relationships

### Simplified Entity Hierarchy

```
Tenant (1) ←→ (N) Company
Company (1) ←→ (N) User (via UserCompanyRole)
Company (1) ←→ (N) MilkCollectionBranch
Company (1) ←→ (N) Factory  
Company (1) ←→ (N) Shop
Company (1) ←→ (N) StorageRoom

MilkCollectionBranch (1) ←→ (N) Farmer
MilkCollectionBranch (1) ←→ (N) DailyCollection
DailyCollection (1) ←→ (N) QualityTest

Factory (1) ←→ (N) ProductionBatch
Factory (1) ←→ (N) Product

Inventory (N) ←→ (1) Company
Inventory (N) ←→ (1) StorageRoom
```

## Simplified Role System

### Role Hierarchy (No Module Dependencies)

```java
public enum DairyRole {
    // System Level
    SYSTEM_ADMIN("System Administrator"),
    
    // Tenant Level (Business Owner/Admin)
    TENANT_ADMIN("Tenant Administrator"),
    
    // Operational Roles
    FACTORY_MANAGER("Factory Manager"),
    MCB_MANAGER("Milk Collection Branch Manager"),
    SHOP_MANAGER("Shop Manager"),
    STORAGE_MANAGER("Storage Manager"),
    
    // Staff Roles
    FACTORY_STAFF("Factory Staff"),
    MCB_STAFF("MCB Staff"),
    SHOP_STAFF("Shop Staff"),
    QUALITY_INSPECTOR("Quality Inspector"),
    DELIVERY_STAFF("Delivery Staff"),
    
    // External Roles
    FARMER("Farmer"),
    CUSTOMER("Customer");
}
```

## Database Tables (Post-Refactoring)

### Core Tables (Keep & Modify)
```sql
-- Keep existing structure
tenant (remove module_type column)
company  
user
user_company_role (simplified roles)
role (dairy-specific roles only)
permission
role_permission
revinfo (audit)

-- Audit tables for all above
tenant_aud, company_aud, user_aud, etc.
```

### New Dairy Domain Tables
```sql
-- Milk Collection
milk_collection_branch (id, name, code, address, company_id, manager_id)
farmer (id, name, code, phone, address, mcb_id, bank_details)
daily_collection (id, farmer_id, mcb_id, date, quantity, fat_percent, snf_percent)
quality_test (id, collection_id, test_type, result, tested_by, tested_at)

-- Factory Operations  
factory (id, name, code, address, company_id, manager_id, capacity)
production_batch (id, factory_id, batch_number, raw_milk_quantity, start_time, end_time)
batch_product (id, batch_id, product_id, quantity_produced, quality_grade)

-- Products
product (id, name, code, category, unit_type, shelf_life_days)
product_category (id, name, description)

-- Inventory
inventory_transaction (id, company_id, location_id, location_type, product_id, transaction_type, quantity, date)
storage_room (id, name, code, company_id, capacity, temperature_range, storage_type)
stock_level (id, location_id, location_type, product_id, current_quantity, min_level, max_level)

-- Retail
shop (id, name, code, address, company_id, manager_id)
sale_transaction (id, shop_id, customer_id, total_amount, payment_method, sale_date)
sale_item (id, transaction_id, product_id, quantity, unit_price, total_price)

-- Customer
customer (id, name, phone, email, address, company_id, registration_date)
```

## API Structure

### Standardized API Endpoints

```
/api/v1/
├── auth/                           # Authentication
│   ├── login
│   ├── refresh
│   └── logout
├── admin/                          # System & Tenant Admin
│   ├── tenants/
│   ├── companies/
│   └── users/
├── companies/                      # Company management
│   ├── {companyId}/settings
│   └── {companyId}/users
├── dairy/                          # Dairy operations
│   ├── mcb/                        # Milk Collection Branches
│   │   ├── /{mcbId}/farmers
│   │   ├── /{mcbId}/collections
│   │   └── /{mcbId}/quality-tests
│   ├── factories/
│   │   ├── /{factoryId}/batches
│   │   └── /{factoryId}/production
│   ├── shops/
│   │   ├── /{shopId}/sales
│   │   └── /{shopId}/inventory
│   ├── inventory/
│   │   ├── transactions
│   │   ├── stock-levels
│   │   └── movements
│   ├── storage/
│   │   └── /{storageId}/stock
│   └── products/
└── reports/                        # Reporting
    ├── daily-collection
    ├── production
    ├── sales
    └── inventory
```

## Security Configuration

### Simplified Authorization Rules

```java
@PreAuthorize("hasRole('SYSTEM_ADMIN')")              // System operations
@PreAuthorize("hasRole('TENANT_ADMIN')")              // Tenant operations  
@PreAuthorize("hasRole('COMPANY_ADMIN')")             // Company operations
@PreAuthorize("hasAnyRole('FACTORY_MANAGER', 'FACTORY_STAFF')")  // Factory access
@PreAuthorize("hasAnyRole('MCB_MANAGER', 'MCB_STAFF')")          // MCB access
@PreAuthorize("hasAnyRole('SHOP_MANAGER', 'SHOP_STAFF')")        // Shop access
```

## Configuration Changes

### Application Properties
```yaml
# Remove module-related configurations
# Keep tenant, security, database configurations
spring:
  application:
    name: dairy-management-system
  datasource:
    url: jdbc:postgresql://localhost:5432/dairy_system
  jpa:
    hibernate:
      ddl-auto: validate
    properties:
      hibernate:
        envers:
          audit_table_suffix: _aud

# Dairy-specific configurations
dairy:
  quality:
    fat:
      min: 3.0
      max: 6.0
    snf:
      min: 8.0  
      max: 10.0
  collection:
    timings:
      morning: "06:00-10:00"
      evening: "16:00-20:00"
```

## Key Benefits of New Structure

1. **Simplified**: No module abstraction layer
2. **Domain-Focused**: Clear dairy business logic organization
3. **Maintainable**: Direct feature development path
4. **Scalable**: Easy to add new dairy features
5. **Performance**: Fewer database joins and complex queries
6. **Security**: Role-based access without module complexity

## Migration Strategy

1. **Phase 1**: Remove module tables and references
2. **Phase 2**: Create dairy domain tables
3. **Phase 3**: Migrate existing data
4. **Phase 4**: Update role system
5. **Phase 5**: Implement dairy features 