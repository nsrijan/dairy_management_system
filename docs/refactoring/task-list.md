# Dairy Management System - Refactoring Task List

## Overview
This document provides a detailed, sequential task list for refactoring the multi-module system into a dairy-focused application. Each task includes specific implementation details and acceptance criteria.

---

## **PRELIMINARY: Frontend Constants Simplification**

### **Task 0.1: Simplify Constants Structure**
- **Action**: Remove over-engineered constants for dairy-only system
- **Files to modify**:
  - ✅ **COMPLETED**: Delete `web/constants/domains.ts` (over-engineered for dairy-only)
  - ✅ **COMPLETED**: Simplify `web/constants/roles.ts` (remove complex hierarchy)
  - ✅ **COMPLETED**: Create `web/constants/routes.ts` (simple route access control)
  - ✅ **COMPLETED**: Update `web/middleware.ts` (use simplified route checking)
  - ✅ **COMPLETED**: Update `web/features/navigation/getNavItems.tsx` (remove /dairy prefix)
- **Rationale**: Complex domain/module system was overhead for dairy-only application
- **Time**: 2 hours ✅ **COMPLETED**

### **Task 0.2: Remove /dairy Prefix from Routes**
- **Action**: Simplify frontend routes by removing /dairy prefix throughout
- **Route Changes**:
  ```
  OLD (complex):           NEW (clean):
  /dairy/mcb          →    /mcb
  /dairy/factory      →    /factory  
  /dairy/shops        →    /shops
  /dairy/farmers      →    /farmers
  /dairy/products     →    /products
  /dairy/inventory    →    /inventory
  /dairy/quality      →    /quality
  /dairy/reports      →    /reports
  /dairy/farmer       →    /farmer (personal dashboard)
  ```
- **Files Updated**:
  - ✅ `web/constants/routes.ts` - Clean route access control
  - ✅ `web/middleware.ts` - Updated route matching and dashboard routing
  - ✅ `web/features/navigation/getNavItems.tsx` - Clean navigation URLs
- **Benefits**: Cleaner URLs, less complexity, better UX
- **Time**: 1 hour ✅ **COMPLETED**

---

## **WEEK 1: Backend Module System Removal**

### **Day 1: Database Schema Analysis & Planning**

#### Task 1.1: Analyze Current Module Dependencies
- **Action**: Document all database tables related to module system
- **Files to examine**: 
  - `V30__create_module_tables.sql`
  - `V31__create_module_audit_tables.sql` 
  - `V35__add_module_to_role.sql`
- **Deliverable**: List of tables to drop and columns to remove
- **Time**: 2 hours

#### Task 1.2: Create Module Removal Migration
- **Action**: Create new migration file `V38__remove_module_system.sql`
- **Implementation**:
  ```sql
  -- Drop foreign key constraints first
  ALTER TABLE role DROP CONSTRAINT IF EXISTS fk_role_module;
  
  -- Remove module columns from role table
  ALTER TABLE role DROP COLUMN IF EXISTS module_id;
  ALTER TABLE role DROP COLUMN IF EXISTS module_type;
  ALTER TABLE role_aud DROP COLUMN IF EXISTS module_id;
  ALTER TABLE role_aud DROP COLUMN IF EXISTS module_type;
  
  -- Drop module-related tables
  DROP TABLE IF EXISTS tenant_module_aud;
  DROP TABLE IF EXISTS tenant_module;
  DROP TABLE IF EXISTS feature_aud;
  DROP TABLE IF EXISTS feature;
  DROP TABLE IF EXISTS module_aud;
  DROP TABLE IF EXISTS module;
  
  -- Remove module_type from tenant table
  ALTER TABLE tenant DROP COLUMN IF EXISTS module_type;
  ALTER TABLE tenant_aud DROP COLUMN IF EXISTS module_type;
  ```
- **Time**: 3 hours

#### Task 1.3: Create Dairy Role System Migration
- **Action**: Create migration `V39__create_dairy_roles.sql`
- **Implementation**:
  ```sql
  -- Clear existing roles and start fresh with dairy-specific roles
  TRUNCATE TABLE user_company_role;
  TRUNCATE TABLE role_permission;
  TRUNCATE TABLE role;
  
  -- Insert dairy-specific roles (removed COMPANY_ADMIN - TENANT_ADMIN handles all business operations)
  INSERT INTO role (name, description, created_at, created_by) VALUES
  ('SYSTEM_ADMIN', 'System Administrator', NOW(), 'system'),
  ('TENANT_ADMIN', 'Tenant Administrator - Business Owner/Admin', NOW(), 'system'),
  ('FACTORY_MANAGER', 'Factory Manager', NOW(), 'system'),
  ('MCB_MANAGER', 'Milk Collection Branch Manager', NOW(), 'system'),
  ('SHOP_MANAGER', 'Shop Manager', NOW(), 'system'),
  ('FACTORY_STAFF', 'Factory Staff', NOW(), 'system'),
  ('MCB_STAFF', 'MCB Staff', NOW(), 'system'),
  ('SHOP_STAFF', 'Shop Staff', NOW(), 'system'),
  ('FARMER', 'Farmer', NOW(), 'system'),
  ('CUSTOMER', 'Customer', NOW(), 'system');
  ```
- **Time**: 2 hours

### **Day 2: Backend Code Cleanup**

#### Task 2.1: Remove Module-Related Packages
- **Action**: Delete entire module management packages
- **Files to delete**:
  - `src/main/java/com/jaysambhu/modulynx/core/module/`
  - All files in this directory (controller, service, repository, dto, model)
- **Time**: 1 hour

#### Task 2.2: Update Application Name and Package Structure
- **Action**: Rename packages from `modulynx` to `dairysystem`
- **Files to update**:
  - `src/main/java/com/jaysambhu/modulynx/` → `src/main/java/com/jaysambhu/dairysystem/`
  - `ModulynxApplication.java` → `DairySystemApplication.java`
  - Update all package imports across the codebase
- **Time**: 4 hours

#### Task 2.3: Remove Module References from Services
- **Action**: Clean up module-related code from existing services
- **Files to update**:
  - `UserService` - Remove module-related methods
  - `TenantService` - Remove module_type handling
  - `RoleService` - Simplify to dairy-specific roles
- **Implementation**: Remove any method containing "module" in name
- **Time**: 3 hours

### **Day 3: Create Dairy Domain Structure**

#### Task 3.1: Create Dairy Package Structure
- **Action**: Create new package structure for dairy domain
- **Directory structure**:
  ```
  src/main/java/com/jaysambhu/dairysystem/dairy/
  ├── milkcollection/
  │   ├── controller/
  │   ├── dto/
  │   ├── model/
  │   ├── repository/
  │   └── service/
  ├── farmer/
  ├── factory/
  ├── inventory/
  ├── storage/
  ├── shop/
  ├── product/
  ├── quality/
  └── shared/
  ```
- **Time**: 1 hour

#### Task 3.2: Create Core Dairy Entities
- **Action**: Create base entity classes
- **Files to create**:
  1. `MilkCollectionBranch.java`
  2. `Farmer.java`
  3. `DailyCollection.java`
  4. `QualityTest.java`
  5. `Factory.java`
  6. `Product.java`
- **Implementation**: Each entity should extend `BaseEntity` and include tenant isolation
- **Time**: 6 hours

### **Day 4: Database Schema for Dairy Domain**

#### Task 4.1: Create Dairy Tables Migration
- **Action**: Create migration `V40__create_dairy_tables.sql`
- **Implementation**:
  ```sql
  -- Milk Collection Branch
  CREATE TABLE milk_collection_branch (
      id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      code VARCHAR(50) NOT NULL,
      address TEXT,
      phone VARCHAR(20),
      capacity_liters INTEGER,
      company_id BIGINT NOT NULL,
      manager_id BIGINT,
      tenant_id BIGINT NOT NULL,
      active BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMP NOT NULL,
      created_by VARCHAR(255),
      updated_at TIMESTAMP,
      updated_by VARCHAR(255),
      version BIGINT,
      CONSTRAINT fk_mcb_company FOREIGN KEY (company_id) REFERENCES company(id),
      CONSTRAINT fk_mcb_manager FOREIGN KEY (manager_id) REFERENCES "user"(id),
      CONSTRAINT fk_mcb_tenant FOREIGN KEY (tenant_id) REFERENCES tenant(id),
      CONSTRAINT uk_mcb_code_tenant UNIQUE (code, tenant_id)
  );
  
  -- Farmer
  CREATE TABLE farmer (
      id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      code VARCHAR(50) NOT NULL,
      phone VARCHAR(20),
      address TEXT,
      bank_account VARCHAR(50),
      ifsc_code VARCHAR(20),
      mcb_id BIGINT NOT NULL,
      tenant_id BIGINT NOT NULL,
      active BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMP NOT NULL,
      created_by VARCHAR(255),
      updated_at TIMESTAMP,
      updated_by VARCHAR(255),
      version BIGINT,
      CONSTRAINT fk_farmer_mcb FOREIGN KEY (mcb_id) REFERENCES milk_collection_branch(id),
      CONSTRAINT fk_farmer_tenant FOREIGN KEY (tenant_id) REFERENCES tenant(id),
      CONSTRAINT uk_farmer_code_mcb UNIQUE (code, mcb_id)
  );
  
  -- Daily Collection
  CREATE TABLE daily_collection (
      id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
      farmer_id BIGINT NOT NULL,
      mcb_id BIGINT NOT NULL,
      collection_date DATE NOT NULL,
      session VARCHAR(10) NOT NULL, -- 'MORNING' or 'EVENING'
      quantity_liters DECIMAL(8,2) NOT NULL,
      fat_percent DECIMAL(4,2),
      snf_percent DECIMAL(4,2),
      temperature DECIMAL(4,1),
      ph_level DECIMAL(3,1),
      rate_per_liter DECIMAL(6,2),
      total_amount DECIMAL(10,2),
      tenant_id BIGINT NOT NULL,
      created_at TIMESTAMP NOT NULL,
      created_by VARCHAR(255),
      updated_at TIMESTAMP,
      updated_by VARCHAR(255),
      version BIGINT,
      CONSTRAINT fk_collection_farmer FOREIGN KEY (farmer_id) REFERENCES farmer(id),
      CONSTRAINT fk_collection_mcb FOREIGN KEY (mcb_id) REFERENCES milk_collection_branch(id),
      CONSTRAINT fk_collection_tenant FOREIGN KEY (tenant_id) REFERENCES tenant(id),
      CONSTRAINT uk_collection_farmer_date_session UNIQUE (farmer_id, collection_date, session)
  );
  ```
- **Time**: 4 hours

#### Task 4.2: Create Factory & Product Tables
- **Action**: Extend migration with factory and product tables
- **Time**: 3 hours

### **Day 5: Update Security Configuration**

#### Task 5.1: Simplify Role-Based Security
- **Action**: Update security configurations to use new dairy roles
- **Files to update**:
  - Remove `@PreAuthorize` annotations that reference modules
  - Update role checks to use new dairy roles
  - Simplify permission structure
- **Time**: 4 hours

#### Task 5.2: Test Backend Changes
- **Action**: Ensure application starts without module dependencies
- **Implementation**:
  - Run application and verify no module-related errors
  - Test basic authentication flows
  - Verify database migrations run successfully
- **Time**: 4 hours

---

## **WEEK 2: Frontend Module System Removal**

### **Day 1: Remove Module Management Frontend**

#### Task 6.1: Delete Module Management Features
- **Action**: Remove all module-related frontend code
- **Files/Directories to delete**:
  - `web/features/admin/modules/` (entire directory)
  - `web/app/admin/modules/` (entire directory)
  - Module references in navigation
- **Time**: 2 hours

#### Task 6.2: Update Admin Navigation
- **Action**: Simplify admin navigation to remove module management
- **Files to update**:
  - `web/features/navigation/getNavItems.tsx`
  - `web/components/layout/AppSidebar.tsx`
  - Remove module selection from admin dashboard
- **Time**: 3 hours

#### Task 6.3: Update Admin Dashboard
- **Action**: Simplify admin dashboard without module management
- **Files to update**:
  - `web/features/domains/admin/components/AdminDashboard.tsx`
  - Remove module-related statistics and management panels
- **Time**: 3 hours

### **Day 2: Create Dairy-Focused Structure**

#### Task 7.1: Create Feature Structure (No /dairy prefix)
- **Action**: Set up new feature directories (clean, no dairy prefix)
- **Directory structure**:
  ```
  web/features/
  ├── mcb/
  │   ├── components/
  │   ├── hooks/
  │   ├── services/
  │   └── types/
  ├── farmers/
  ├── factory/
  ├── inventory/
  ├── storage/
  ├── shops/
  ├── products/
  └── shared/
  ```
- **Time**: 1 hour

#### Task 7.2: Create Clean Route Structure (No /dairy Prefix)
- **Action**: Set up new route structure for dairy operations with clean URLs
- **Files to create**:
  - `web/app/(dashboard)/mcb/page.tsx` - MCB list page
  - `web/app/(dashboard)/factory/page.tsx` - Factory list page
  - `web/app/(dashboard)/shops/page.tsx` - Shop list page
  - `web/app/(dashboard)/inventory/page.tsx` - Inventory overview
  - `web/app/(dashboard)/products/page.tsx` - Product management
  - `web/app/(dashboard)/quality/page.tsx` - Quality testing page
  - `web/app/(dashboard)/storage/page.tsx` - Storage management
  - `web/app/(dashboard)/farmers/page.tsx` - Farmer management
  - `web/app/(dashboard)/reports/page.tsx` - Reports dashboard
  - `web/app/farmer/page.tsx` - Farmer personal dashboard
- **Note**: Clean URLs without /dairy prefix for better UX
- **Time**: 4 hours

#### Task 7.3: Update Main Navigation (Clean URLs)
- **Action**: Create dairy-focused navigation structure with clean URLs
- **Implementation**:
  ```typescript
  const mainNavigation = [
    { name: 'Dashboard', href: '/dashboard' },
    { 
      name: 'Operations', 
      children: [
        { name: 'Milk Collection', href: '/mcb' },
        { name: 'Factory', href: '/factory' },
        { name: 'Shops', href: '/shops' },
        { name: 'Inventory', href: '/inventory' },
        { name: 'Storage', href: '/storage' },
        { name: 'Products', href: '/products' },
        { name: 'Farmers', href: '/farmers' },
        { name: 'Quality Testing', href: '/quality' },
      ]
    },
    { name: 'Reports', href: '/reports' }
  ];
  ```
- **✅ COMPLETED**: Navigation updated with clean URLs (no /dairy prefix)
- **Time**: 3 hours ✅ **COMPLETED**

### **Day 3: Role-Based Dashboard Restructure**

#### Task 8.1: Create Role-Specific Dashboards
- **Action**: Create separate dashboard components for each role
- **Files to create**:
  - `SystemAdminDashboard.tsx`
  - `TenantAdminDashboard.tsx` (Enhanced - handles all business operations)
  - `FactoryManagerDashboard.tsx`
  - `MCBManagerDashboard.tsx`
  - `ShopManagerDashboard.tsx`
- **Time**: 6 hours

#### Task 8.2: Implement Dashboard Routing Logic
- **Action**: Update main dashboard page to route based on user role
- **File**: `web/app/(dashboard)/dashboard/page.tsx`
- **Implementation**:
  ```typescript
  export default function DashboardPage() {
    const { user } = useAuthStore();
    
    const getDashboardComponent = () => {
          switch(user.primaryRole) {
      case 'SYSTEM_ADMIN': return <SystemAdminDashboard />;
      case 'TENANT_ADMIN': return <TenantAdminDashboard />;
      case 'FACTORY_MANAGER': return <FactoryManagerDashboard />;
      case 'MCB_MANAGER': return <MCBManagerDashboard />;
      case 'SHOP_MANAGER': return <ShopManagerDashboard />;
      default: return <DefaultDashboard />;
    }
    };
    
    return <AppLayout>{getDashboardComponent()}</AppLayout>;
  }
  ```
- **Time**: 2 hours

### **Day 4: Authentication & State Management Updates**

#### Task 9.1: Update Authentication Service
- **Action**: Remove module-related authentication logic
- **Files to update**:
  - `web/features/auth/login/loginService.ts`
  - Remove module selection from login flow
  - Update role mapping to new dairy roles
- **Time**: 3 hours

#### Task 9.2: Update Global State Management
- **Action**: Remove module-related state and add dairy context
- **Files to update**:
  - Remove `moduleStore.ts`
  - Update `authStore.ts` to handle new role structure
  - Create `dairyStore.ts` for dairy-specific global state
- **Time**: 4 hours

#### Task 9.3: Update Route Protection
- **Action**: Simplify route protection without module complexity
- **File**: `web/middleware.ts`
- **Implementation**: Remove module-based route protection, keep role-based
- **Time**: 1 hour

### **Day 5: Basic Dairy Components**

#### Task 10.1: Create MCB Management Components
- **Action**: Create basic components for Milk Collection Branch management
- **Files to create**:
  - `MCBList.tsx` - List all MCBs
  - `MCBForm.tsx` - Create/Edit MCB
  - `MCBCard.tsx` - MCB display card
- **Time**: 6 hours

#### Task 10.2: Create Farmer Management Components
- **Action**: Create basic components for Farmer management
- **Files to create**:
  - `FarmerList.tsx`
  - `FarmerForm.tsx`
  - `FarmerCard.tsx`
- **Time**: 2 hours

---

## **WEEK 3: Dairy Business Logic Implementation**

### **Day 1: MCB Features Implementation**

#### Task 11.1: MCB CRUD Operations
- **Action**: Implement complete MCB management
- **Backend Implementation**:
  - Create `MCBController` with full CRUD operations
  - Create `MCBService` with business logic
  - Create `MCBRepository` with custom queries
- **Frontend Implementation**:
  - Connect MCB components to API
  - Implement create, read, update, delete operations
  - Add validation and error handling
- **Time**: 8 hours

### **Day 2: Farmer Management & Daily Collection**

#### Task 12.1: Farmer Registration System
- **Action**: Implement farmer registration and management
- **Features**:
  - Farmer registration form with validation
  - Farmer profile management
  - Bank details management
  - MCB assignment
- **Time**: 4 hours

#### Task 12.2: Daily Collection Recording
- **Action**: Implement daily milk collection recording
- **Features**:
  - Collection entry form (quantity, quality parameters)
  - Morning/Evening session handling
  - Rate calculation based on quality
  - Collection history display
- **Time**: 4 hours

### **Day 3: Quality Testing & Payment System**

#### Task 13.1: Quality Testing Module
- **Action**: Implement milk quality testing
- **Features**:
  - Quality parameter recording (Fat, SNF, Temperature, pH)
  - Quality grading system
  - Quality history tracking
  - Quality-based pricing
- **Time**: 4 hours

#### Task 13.2: Payment Calculation System
- **Action**: Implement farmer payment calculations
- **Features**:
  - Rate calculation based on quality parameters
  - Daily/Monthly payment summaries
  - Payment history
  - Export payment reports
- **Time**: 4 hours

### **Day 4: Factory & Inventory Basics**

#### Task 14.1: Factory Management
- **Action**: Create basic factory management system
- **Features**:
  - Factory registration and profiles
  - Production capacity tracking
  - Basic production recording
- **Time**: 4 hours

#### Task 14.2: Basic Inventory System
- **Action**: Implement basic inventory tracking
- **Features**:
  - Stock level monitoring
  - Inventory transactions
  - Low stock alerts
  - Basic inventory reports
- **Time**: 4 hours

### **Day 5: Integration & Testing**

#### Task 15.1: End-to-End Integration
- **Action**: Ensure all components work together
- **Implementation**:
  - Test complete flow: MCB → Farmer → Collection → Quality → Payment
  - Verify role-based access control
  - Test multi-tenant isolation
- **Time**: 4 hours

#### Task 15.2: Basic Reporting Dashboard
- **Action**: Create basic reporting and analytics
- **Features**:
  - Daily collection summary
  - Quality trends
  - Payment summaries
  - Performance metrics
- **Time**: 4 hours

---

## **POST-WEEK 3: Future Enhancements**

### **Phase 4: Advanced Features (Future)**
- Shop management and POS system
- Advanced inventory management
- Production planning and tracking
- Customer management
- Advanced reporting and analytics
- Mobile app integration
- Real-time notifications
- Integration with external systems

---

## **Success Criteria**

### **Preliminary Completion**
- [x] ✅ Constants structure simplified (removed over-engineering)
- [x] ✅ Route structure cleaned (removed /dairy prefix)
- [x] ✅ Navigation updated with clean URLs
- [x] ✅ Middleware updated for simplified route checking
- [x] ✅ Role-based access control simplified

### **Week 1 Completion**
- [ ] Application starts without module-related errors
- [ ] Database migrations run successfully
- [ ] New dairy role system is functional
- [ ] All module-related code is removed from backend

### **Week 2 Completion**
- [ ] Frontend loads without module management features
- [ ] Role-based navigation works correctly
- [ ] Authentication flow works with new roles
- [ ] Basic dairy route structure is in place

### **Week 3 Completion**
- [ ] MCB management is fully functional
- [ ] Farmer registration and management works
- [ ] Daily collection recording is operational
- [ ] Quality testing and payment calculation works
- [ ] Basic reporting is available

### **Overall Success**
- [ ] Application is dairy-focused without module complexity
- [ ] Multi-tenancy and company management still works
- [ ] Role-based access control is functional
- [ ] Audit system continues to work
- [ ] Performance is improved due to simplified architecture
- [ ] Codebase is cleaner and more maintainable

---

## **Risk Mitigation**

1. **Database Backup**: Create full database backup before starting migrations
2. **Feature Branches**: Use separate git branches for each major task
3. **Incremental Testing**: Test after each day's changes
4. **Rollback Plan**: Keep ability to rollback to current module system if needed
5. **Documentation**: Document all changes for future reference 