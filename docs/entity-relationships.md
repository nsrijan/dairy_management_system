# Dairy Management System - Entity Relationships

This document outlines the core entities in the Dairy Management System and their relationships.

## Core Entities

### Tenant
The top-level entity representing an organization using the system.

**Fields:**
- id (Long, PK)
- name (String)
- slug (String) - Used for subdomain resolution
- isActive (Boolean)
- createdAt, createdBy, updatedAt, updatedBy (Audit fields)

**Relationships:**
- One-to-Many with Company
- One-to-Many with User

### Company
A company or business unit within a tenant.

**Fields:**
- id (Long, PK)
- name (String)
- description (String)
- isActive (Boolean)
- tenantId (FK)
- createdAt, createdBy, updatedAt, updatedBy (Audit fields)

**Relationships:**
- Many-to-One with Tenant
- One-to-Many with UserCompanyRole
- One-to-Many with Supplier
- One-to-Many with Product
- One-to-Many with Inventory

### Role
Defines the available roles in the system.

**Fields:**
- id (Long, PK)
- name (String) - Enum value
- description (String)
- roleType (Enum) - SYSTEM, TENANT, COMPANY
- createdAt, createdBy, updatedAt, updatedBy (Audit fields)

**Relationships:**
- Many-to-Many with Permission
- One-to-Many with UserCompanyRole

### Permission
Granular permissions that can be assigned to roles.

**Fields:**
- id (Long, PK)
- name (String)
- description (String)
- createdAt, createdBy, updatedAt, updatedBy (Audit fields)

**Relationships:**
- Many-to-Many with Role

### User
Represents a user of the system.

**Fields:**
- id (Long, PK)
- username (String)
- email (String)
- password (String) - Encrypted
- firstName (String)
- lastName (String)
- phone (String)
- isActive (Boolean)
- isEmailVerified (Boolean)
- isPhoneVerified (Boolean)
- userType (Enum) - INTERNAL, SUPPLIER, CUSTOMER
- primaryTenantId (FK)
- createdAt, createdBy, updatedAt, updatedBy (Audit fields)

**Relationships:**
- Many-to-One with Tenant (primary tenant)
- One-to-Many with UserCompanyRole
- One-to-One with UserProfile (optional)

### UserCompanyRole
Junction entity linking users to roles within specific companies.

**Fields:**
- id (Long, PK)
- userId (FK)
- companyId (FK)
- roleId (FK)
- isActive (Boolean)
- createdAt, createdBy, updatedAt, updatedBy (Audit fields)

**Relationships:**
- Many-to-One with User
- Many-to-One with Company
- Many-to-One with Role

### UserProfile
Extended user information.

**Fields:**
- id (Long, PK)
- userId (FK)
- address (String)
- city (String)
- state (String)
- postalCode (String)
- country (String)
- profilePictureUrl (String)
- dateOfBirth (Date)
- createdAt, createdBy, updatedAt, updatedBy (Audit fields)

**Relationships:**
- One-to-One with User

### Supplier
Represents a supplier providing materials or products.

**Fields:**
- id (Long, PK)
- name (String)
- contactPerson (String)
- email (String)
- phone (String)
- address (String)
- supplierType (Enum) - FARMER, MATERIAL_SUPPLIER, OTHER
- userId (FK) - Optional, if supplier is also a user
- companyId (FK)
- tenantId (FK)
- isActive (Boolean)
- createdAt, createdBy, updatedAt, updatedBy (Audit fields)

**Relationships:**
- Many-to-One with Company
- Many-to-One with Tenant
- Many-to-One with User (optional)
- One-to-Many with SupplierProduct

### Product
Represents a product or material in the system.

**Fields:**
- id (Long, PK)
- name (String)
- description (String)
- sku (String)
- uom (String) - Unit of Measure
- price (BigDecimal)
- costPrice (BigDecimal)
- categoryId (FK)
- companyId (FK)
- tenantId (FK)
- isActive (Boolean)
- productType (Enum) - RAW_MATERIAL, FINISHED_PRODUCT, SERVICE
- createdAt, createdBy, updatedAt, updatedBy (Audit fields)

**Relationships:**
- Many-to-One with Company
- Many-to-One with Tenant
- Many-to-One with Category
- One-to-Many with Inventory

### Category
Categorization for products.

**Fields:**
- id (Long, PK)
- name (String)
- description (String)
- parentCategoryId (FK) - For hierarchical categories
- companyId (FK)
- tenantId (FK)
- createdAt, createdBy, updatedAt, updatedBy (Audit fields)

**Relationships:**
- Self-referencing for parent/child categories
- Many-to-One with Company
- Many-to-One with Tenant
- One-to-Many with Product

### Inventory
Tracks inventory levels for products.

**Fields:**
- id (Long, PK)
- productId (FK)
- warehouseId (FK)
- quantityOnHand (BigDecimal)
- reservedQuantity (BigDecimal)
- availableQuantity (BigDecimal)
- minStockLevel (BigDecimal)
- maxStockLevel (BigDecimal)
- reorderPoint (BigDecimal)
- companyId (FK)
- tenantId (FK)
- createdAt, createdBy, updatedAt, updatedBy (Audit fields)

**Relationships:**
- Many-to-One with Product
- Many-to-One with Warehouse
- Many-to-One with Company
- Many-to-One with Tenant
- One-to-Many with InventoryTransaction

### InventoryTransaction
Records movement of inventory.

**Fields:**
- id (Long, PK)
- inventoryId (FK)
- transactionType (Enum) - RECEIPT, ISSUE, ADJUSTMENT, TRANSFER
- quantity (BigDecimal)
- referenceType (String) - e.g., "PurchaseOrder", "SalesOrder"
- referenceId (Long) - ID of related entity
- notes (String)
- companyId (FK)
- tenantId (FK)
- createdAt, createdBy, updatedAt, updatedBy (Audit fields)

**Relationships:**
- Many-to-One with Inventory
- Many-to-One with Company
- Many-to-One with Tenant

### Order
Represents a customer order.

**Fields:**
- id (Long, PK)
- orderNumber (String)
- customerId (FK)
- orderDate (Date)
- deliveryDate (Date)
- status (Enum) - DRAFT, CONFIRMED, PROCESSING, SHIPPED, DELIVERED, CANCELLED
- totalAmount (BigDecimal)
- notes (String)
- companyId (FK)
- tenantId (FK)
- createdAt, createdBy, updatedAt, updatedBy (Audit fields)

**Relationships:**
- Many-to-One with Customer
- Many-to-One with Company
- Many-to-One with Tenant
- One-to-Many with OrderItem
- One-to-Many with Payment

### OrderItem
Line items in an order.

**Fields:**
- id (Long, PK)
- orderId (FK)
- productId (FK)
- quantity (BigDecimal)
- unitPrice (BigDecimal)
- totalPrice (BigDecimal)
- discountAmount (BigDecimal)
- notes (String)
- createdAt, createdBy, updatedAt, updatedBy (Audit fields)

**Relationships:**
- Many-to-One with Order
- Many-to-One with Product

## Entity Relationship Diagram (Conceptual)

```
   Tenant
     |
     |── Company
     |     |
     |     |── UserCompanyRole ── Role ── Permission
     |     |         |
     |     |         |
     |     |      User ── UserProfile
     |     |
     |     |── Supplier
     |     |     |
     |     |     └── SupplierProduct
     |     |
     |     |── Product ── Category
     |     |     |
     |     |     └── Inventory ── InventoryTransaction
     |     |
     |     |── Order ── OrderItem
     |     |     |
     |     |     └── Payment
     |     |
     |     └── (Other company-specific entities)
     |
     └── (Other tenant-wide entities)
```

## Multi-Tenancy Design

- All major entities include a `tenantId` field for tenant isolation
- Repository methods filter by tenant ID from `TenantContext`
- Service methods verify tenant access before operations
- Controllers use appropriate security annotations to enforce role-based access

## Audit Trail

- All entities extend `BaseEntity` which includes:
  - createdAt (timestamp)
  - createdBy (username)
  - updatedAt (timestamp)
  - updatedBy (username)

- Hibernate Envers tracks all entity revisions in:
  - `{entity}_aud` tables
  - central `revision_info` table with username, timestamp, and action 