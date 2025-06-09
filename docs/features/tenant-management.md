# Tenant Management Feature

## Overview
This document outlines the tenant management features including tenant details, editing, and associated functionalities.

## Features

### 1. Tenant Details Page (`/admin/tenants/[id]`)
- **Overview Tab**
  - [x] Display tenant stats (Active Modules, Companies, Users, Days Active)
  - [ ] Edit button functionality
  - [ ] Delete tenant functionality
  - [ ] Pre-populate edit form with existing values
  
- **Details Tab**
  - [ ] Show comprehensive tenant information
  - [ ] Display tenant configuration
  - [ ] Show tenant status and history

### 2. Companies Management
- [ ] List companies under tenant
- [ ] Add new company
- [ ] Edit company details
- [ ] Delete company
- [ ] Company status management

### 3. State Management
#### Zustand Stores
```typescript
// Tenant Store
interface TenantStore {
  currentTenant: Tenant | null;
  setCurrentTenant: (tenant: Tenant) => void;
  companies: Company[];
  setCompanies: (companies: Company[]) => void;
}

// Module Store
interface ModuleStore {
  modules: Module[];
  selectedModules: string[];
  setModules: (modules: Module[]) => void;
  toggleModule: (moduleId: string) => void;
}
```

#### React Query Hooks
```typescript
// Tenant Queries
const useTenantDetails = (tenantId: string) => {
  return useQuery(['tenant', tenantId], () => fetchTenantDetails(tenantId));
};

const useTenantCompanies = (tenantId: string) => {
  return useQuery(['tenant-companies', tenantId], () => fetchTenantCompanies(tenantId));
};

// Mutations
const useUpdateTenant = () => {
  return useMutation(updateTenant, {
    onSuccess: () => {
      queryClient.invalidateQueries(['tenant']);
    },
  });
};
```

## Implementation Steps

1. **Tenant Details Page Enhancement**
   - Create TenantStore for managing tenant state
   - Implement edit functionality with form pre-population
   - Add delete tenant confirmation modal
   - Enhance details display with tabs

2. **Companies Integration**
   - Create CompanyList component
   - Implement company CRUD operations
   - Add company status management
   - Integrate with tenant details

3. **State Management Setup**
   - Set up Zustand stores for tenant and modules
   - Create React Query hooks for data fetching
   - Implement optimistic updates for better UX

## Example Implementation

### Tenant Edit Flow
```typescript
// 1. User clicks edit button
// 2. Current tenant data is loaded into form
// 3. User makes changes
// 4. Changes are validated
// 5. Update is sent to backend
// 6. UI is updated optimistically
// 7. Success/error feedback is shown
```

### Company Management Flow
```typescript
// 1. Companies are loaded with tenant details
// 2. User can perform CRUD operations
// 3. Changes reflect immediately in UI
// 4. Backend sync happens in background
// 5. Error handling with rollback capability
```

## API Endpoints

### Tenant Management
- GET `/api/tenants/{id}` - Get tenant details
- PUT `/api/tenants/{id}` - Update tenant
- DELETE `/api/tenants/{id}` - Delete tenant

### Company Management
- GET `/api/tenants/{id}/companies` - List tenant companies
- POST `/api/tenants/{id}/companies` - Create company
- PUT `/api/tenants/{id}/companies/{companyId}` - Update company
- DELETE `/api/tenants/{id}/companies/{companyId}` - Delete company

## Notes
- Use optimistic updates for better UX
- Implement proper error handling and feedback
- Ensure proper validation on both frontend and backend
- Consider implementing audit logging for changes 