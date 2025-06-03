🧩 Sprint: Multi-Domain Support via Modules & Features
📁 Module Management
1. Create Module Entity

JPA entity Module with fields:

id (Long, PK)

name (String)

code (String, unique)

description (String, optional)

active (Boolean)

createdAt, updatedAt (via BaseEntity if available)

Use Lombok annotations.

Mark with @Entity and @Table(name = "modules").

2. Create ModuleRepository

Interface extending JpaRepository<Module, Long>.

3. Create ModuleService and ModuleServiceImpl

Methods: create, getAll, getById, update, delete.

4. Create ModuleController

@RestController, base path /api/modules.

CRUD endpoints:

POST / → create module

GET / → list all modules

GET /{id} → get module by ID

PUT /{id} → update module

DELETE /{id} → delete module

🔗 Tenant ↔ Module Mapping
5. Create TenantModule Entity

JPA entity with fields:

id (Long, PK)

tenantId (Long)

module (ManyToOne to Module)

enabled (Boolean)

Inherits audit fields via BaseEntity.

6. Create TenantModuleRepository

Interface extending JpaRepository<TenantModule, Long>.

7. Create TenantModuleService and TenantModuleServiceImpl

Methods: assignModuleToTenant, getModulesByTenantId, enable/disableModuleForTenant.

8. Create TenantModuleController

Base path: /api/tenant-modules

Endpoints:

POST / → assign module to tenant

GET /tenant/{tenantId} → get enabled modules for a tenant

PUT /{id} → toggle enable/disable

🧩 Feature Support (Optional/Future Use)
9. Create Feature Entity

Fields:

id (Long, PK)

name (String)

code (String, unique)

description (optional)

module (ManyToOne to Module)

active (Boolean)

Inherits audit fields.

10. Create FeatureRepository, FeatureService, FeatureController

Follow same structure as module.

🧪 Data Initialization / Flyway Migration
11. Add seed modules via data.sql or Flyway V1__init_modules.sql

Insert records like:

Dairy

Garment

Bus

Use code field as enum-like identifiers.


🧭 Frontend Integration Prep
13. API endpoint summary for frontend

/api/modules → all available modules

/api/tenant-modules/tenant/{tenantId} → tenant-specific enabled modules

/api/features?moduleCode=DAIRY → features of a module (if needed)