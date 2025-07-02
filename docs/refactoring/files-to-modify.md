# Files to Modify During Refactoring

## Overview
This document lists all the files that need to be modified when refactoring from the multi-module system to a simplified dairy-focused system.

---

## ✅ **COMPLETED FILES**

### **Constants & Configuration**
- ✅ `web/constants/roles.ts` - Removed COMPANY_ADMIN, updated to dairy-specific roles
- ✅ `web/constants/domains.ts` - Simplified domains, removed POULTRY, updated route access
- ✅ `web/middleware.ts` - Updated role-based routing, added new route patterns

---

## 🔄 **FILES THAT NEED MODIFICATION**

### **1. Navigation & UI Components**
- 🔄 `web/features/navigation/getNavItems.tsx` - **HIGH PRIORITY**
  - Remove references to COMPANY_ADMIN, TENANT_MANAGER
  - Update role-based navigation for new dairy roles
  - Remove module management navigation
  - Add dairy-specific navigation items (MCB, Factory, Shops, etc.)

### **2. Module Management (DELETE ENTIRE FEATURE)**
- 🗑️ `web/features/admin/modules/` - **DELETE ENTIRE DIRECTORY**
  - All files in this directory should be removed
  - Contains module CRUD operations we no longer need

### **3. Admin Features - Tenant Management**
- 🔄 `web/features/admin/tenants/types.ts`
  - Remove ModuleType enum
  - Update tenant interfaces to remove module references
- 🔄 `web/features/admin/tenants/services/tenantService.ts`
  - Remove moduleType from API calls
- 🔄 `web/features/admin/tenants/hooks/useTenantQueries.ts`
  - Remove ModuleType imports and usage

### **4. Authentication & Login**
- 🔄 `web/features/auth/login/loginService.ts`
  - Update role mapping to new dairy roles
  - Remove module determination logic
  - Simplify tenant domain logic

### **5. Dashboard & Registry**
- 🔄 `web/features/dashboard/registry.ts`
  - Remove module-based dashboard registry
  - Simplify to role-based dashboard mapping
- 🔄 Dashboard components in various domain folders
  - Update role-based dashboard components

### **6. Library Files**
- 🔄 `web/lib/auth.ts`
  - Update role definitions
  - Remove module-related auth logic

### **7. Type Definitions**
- 🔄 `web/types/auth.ts` - Update role types
- 🔄 `web/types/common.ts` - Remove module-related types

### **8. Route Pages (App Directory)**
- 🗑️ `web/app/admin/modules/` - **DELETE DIRECTORY**
- 🔄 Update various route pages to use new role checks

### **9. Layout Components**
- 🔄 `web/components/layout/AppSidebar.tsx` - Update to use new navigation
- 🔄 `web/components/layout/AppHeader.tsx` - Remove module references

---

## 📋 **DETAILED MODIFICATION TASKS**

### **Task 1: Update Navigation (HIGH PRIORITY)**
**File**: `web/features/navigation/getNavItems.tsx`

**Current Issues**:
- References to `TENANT_MANAGER`, `COMPANY_ADMIN`, `MANAGER` roles
- Generic navigation items instead of dairy-specific ones

**Required Changes**:
```typescript
// REMOVE these role checks:
- user.role === 'TENANT_MANAGER'
- user.role === 'COMPANY_ADMIN' 
- user.role === 'MANAGER'

// ADD new role checks:
- user.role === 'TENANT_ADMIN'
- user.role === 'FACTORY_MANAGER'
- user.role === 'MCB_MANAGER'
- user.role === 'SHOP_MANAGER'

// REPLACE navigation items:
// Old: Generic items (Suppliers, Inventory, Production, Sales, Distribution)
// New: Dairy-specific items (MCB, Factory, Shops, Products, Farmers, Inventory, Storage)
```

### **Task 2: Remove Module Management**
**Action**: Delete entire `web/features/admin/modules/` directory
**Impact**: Remove all module CRUD operations

### **Task 3: Update Tenant Types**
**File**: `web/features/admin/tenants/types.ts`

**Remove**:
```typescript
export enum ModuleType {
    DAIRY = 'DAIRY',
    // ... other types
}

// Remove moduleType from interfaces
moduleType: ModuleType;
```

### **Task 4: Simplify Authentication**
**File**: `web/features/auth/login/loginService.ts`

**Changes**:
- Remove module domain determination
- Update role mapping for new dairy roles
- Simplify tenant context

### **Task 5: Update Dashboard Registry**
**File**: `web/features/dashboard/registry.ts`

**Changes**:
- Remove module-based routing
- Implement simple role-based dashboard mapping

---

## 🔧 **CRITICAL DEPENDENCIES**

### **Files That Import Removed Types**
Search for these imports that will break:
- `ModuleType` 
- `COMPANY_ADMIN`
- `TENANT_MANAGER`

### **Navigation Dependencies**
- Any component importing `getNavItems` will need testing
- Sidebar components that use role-based rendering

### **Route Protection**
- Pages using old role checks will need updates
- Middleware route patterns are updated but pages need verification

---

## 🧪 **TESTING REQUIREMENTS**

After modifications, test:
1. **Authentication Flow** - Login with different roles
2. **Navigation** - Each role sees appropriate navigation items
3. **Route Protection** - Users can only access permitted routes
4. **Dashboard Routing** - Correct dashboard for each role

---

## ⚡ **QUICK WINS (Start Here)**

1. **Delete module directory** - Immediate cleanup
2. **Update navigation** - Fixes most UI issues
3. **Update role constants** - Already completed ✅
4. **Test with one role** - Verify basic functionality

---

## 🚨 **POTENTIAL ISSUES**

1. **Broken Imports** - Components importing deleted modules
2. **Missing Routes** - Navigation pointing to non-existent routes  
3. **Role Mismatches** - Backend vs frontend role naming
4. **Database Inconsistency** - If backend roles don't match frontend

---

## 📅 **RECOMMENDED ORDER**

1. ✅ Constants & middleware (DONE)
2. 🔄 Navigation (getNavItems.tsx) - **START HERE**
3. 🗑️ Delete module management directory
4. 🔄 Update admin/tenant types
5. 🔄 Fix authentication service
6. 🔄 Update dashboard registry
7. 🧪 Test basic flows
8. 🔄 Fix remaining type issues 