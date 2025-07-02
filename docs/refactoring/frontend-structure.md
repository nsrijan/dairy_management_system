# Frontend Structure - Dairy Management System (Post-Refactoring)

## Overview

The frontend will be restructured to focus exclusively on dairy operations while maintaining multi-tenancy support and role-based access control. We'll remove module management complexity and create a streamlined dairy-focused interface.

## Directory Structure

```
web/
├── app/                              # Next.js App Router
│   ├── (auth)/                       # Auth route group
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── register/
│   │       └── page.tsx
│   ├── (dashboard)/                  # Main application routes
│   │   ├── admin/                    # System & Tenant Admin
│   │   │   ├── tenants/
│   │   │   │   ├── [id]/
│   │   │   │   │   ├── companies/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   ├── settings/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   └── users/
│   │   │   │   │       └── page.tsx
│   │   │   │   ├── new/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── page.tsx
│   │   │   └── page.tsx
│   │   ├── mcb/                      # Milk Collection Branches
│   │   │   ├── [id]/
│   │   │   │   ├── farmers/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── collections/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── quality/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── dashboard/
│   │   │   │       └── page.tsx
│   │   │   └── page.tsx
│   │   ├── factory/
│   │   │   ├── [id]/
│   │   │   │   ├── production/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── batches/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── dashboard/
│   │   │   │       └── page.tsx
│   │   │   └── page.tsx
│   │   ├── shops/
│   │   │   ├── [id]/
│   │   │   │   ├── sales/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── inventory/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── dashboard/
│   │   │   │       └── page.tsx
│   │   │   └── page.tsx
│   │   ├── inventory/
│   │   │   ├── transactions/
│   │   │   │   └── page.tsx
│   │   │   ├── stock-levels/
│   │   │   │   └── page.tsx
│   │   │   └── page.tsx
│   │   ├── storage/
│   │   │   ├── [id]/
│   │   │   │   └── page.tsx
│   │   │   └── page.tsx
│   │   ├── products/                 # Product management
│   │   │   └── page.tsx
│   │   ├── dashboard/                # Role-based Dashboards
│   │   │   └── page.tsx
│   │   └── reports/                  # Reporting
│   │       ├── daily-collection/
│   │       │   └── page.tsx
│   │       ├── production/
│   │       │   └── page.tsx
│   │       ├── sales/
│   │       │   └── page.tsx
│   │       └── inventory/
│   │           └── page.tsx
│   ├── layout.tsx                    # Root layout
│   ├── globals.css
│   └── loading.tsx
├── components/                       # Shared UI Components
│   ├── ui/                          # Base UI components (shadcn/ui)
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── card.tsx
│   │   ├── table.tsx
│   │   ├── dialog.tsx
│   │   ├── form.tsx
│   │   ├── select.tsx
│   │   ├── calendar.tsx
│   │   ├── chart.tsx
│   │   └── [20+ more components]
│   ├── layout/                      # Layout components
│   │   ├── AppHeader.tsx
│   │   ├── AppSidebar.tsx
│   │   ├── AppLayout.tsx
│   │   ├── Breadcrumbs.tsx
│   │   └── Navigation.tsx
│   ├── auth/                        # Authentication components
│   │   ├── AuthenticatedRoute.tsx
│   │   ├── DomainProtectedRoute.tsx
│   │   ├── RoleGuard.tsx
│   │   └── LoginForm.tsx
│   └── shared/                      # Shared feature components
│       ├── DataTable.tsx
│       ├── PageHeader.tsx
│       ├── StatsCard.tsx
│       ├── ChartCard.tsx
│       ├── LoadingSpinner.tsx
│       └── ErrorBoundary.tsx
├── features/                        # Feature-based modules
│   ├── admin/                       # Admin features
│   │   ├── tenants/
│   │   │   ├── components/
│   │   │   │   ├── TenantList.tsx
│   │   │   │   ├── TenantForm.tsx
│   │   │   │   ├── TenantDetails.tsx
│   │   │   │   └── CompanyManagement.tsx
│   │   │   ├── hooks/
│   │   │   │   └── useTenants.ts
│   │   │   ├── services/
│   │   │   │   └── tenantService.ts
│   │   │   └── types/
│   │   │       └── index.ts
│   │   └── users/
│   │       ├── components/
│   │       ├── hooks/
│   │       ├── services/
│   │       └── types/
│   ├── dashboard/                   # Dashboard features
│   │   ├── components/
│   │   │   ├── DashboardLayout.tsx
│   │   │   ├── SystemAdminDashboard.tsx
│   │   │   ├── TenantAdminDashboard.tsx
│   │   │   ├── CompanyAdminDashboard.tsx
│   │   │   ├── FactoryManagerDashboard.tsx
│   │   │   ├── MCBManagerDashboard.tsx
│   │   │   ├── ShopManagerDashboard.tsx
│   │   │   └── FarmerDashboard.tsx
│   │   ├── hooks/
│   │   │   └── useDashboard.ts
│   │   └── services/
│   │       └── dashboardService.ts
│   ├── mcb/                         # Milk Collection Branch
│   │   ├── components/
│   │   │   ├── MCBList.tsx
│   │   │   ├── MCBForm.tsx
│   │   │   ├── MCBDashboard.tsx
│   │   │   ├── FarmerManagement.tsx
│   │   │   ├── DailyCollectionForm.tsx
│   │   │   ├── CollectionHistory.tsx
│   │   │   ├── QualityTestForm.tsx
│   │   │   ├── PaymentCalculator.tsx
│   │   │   └── MCBReports.tsx
│   │   ├── hooks/
│   │   │   ├── useMCB.ts
│   │   │   ├── useFarmers.ts
│   │   │   ├── useCollections.ts
│   │   │   └── useQualityTests.ts
│   │   ├── services/
│   │   │   ├── mcbService.ts
│   │   │   ├── farmerService.ts
│   │   │   ├── collectionService.ts
│   │   │   └── qualityService.ts
│   │   └── types/
│   │       └── index.ts
│   ├── factory/                     # Factory operations
│   │   ├── components/
│   │   │   ├── FactoryList.tsx
│   │   │   ├── FactoryForm.tsx
│   │   │   ├── FactoryDashboard.tsx
│   │   │   ├── ProductionBatchForm.tsx
│   │   │   ├── BatchTracking.tsx
│   │   │   ├── QualityControl.tsx
│   │   │   └── ProductionReports.tsx
│   │   ├── hooks/
│   │   │   ├── useFactory.ts
│   │   │   ├── useProduction.ts
│   │   │   └── useBatches.ts
│   │   ├── services/
│   │   │   ├── factoryService.ts
│   │   │   └── productionService.ts
│   │   └── types/
│   │       └── index.ts
│   ├── shops/                       # Retail shops
│   │   ├── components/
│   │   │   ├── ShopList.tsx
│   │   │   ├── ShopForm.tsx
│   │   │   ├── ShopDashboard.tsx
│   │   │   ├── POSSystem.tsx
│   │   │   ├── SalesHistory.tsx
│   │   │   ├── CustomerManagement.tsx
│   │   │   └── ShopInventory.tsx
│   │   ├── hooks/
│   │   │   ├── useShops.ts
│   │   │   ├── useSales.ts
│   │   │   └── useCustomers.ts
│   │   ├── services/
│   │   │   ├── shopService.ts
│   │   │   ├── salesService.ts
│   │   │   └── customerService.ts
│   │   └── types/
│   │       └── index.ts
│   ├── inventory/                   # Inventory management
│   │   ├── components/
│   │   │   ├── InventoryDashboard.tsx
│   │   │   ├── StockLevels.tsx
│   │   │   ├── TransactionHistory.tsx
│   │   │   ├── StockMovement.tsx
│   │   │   ├── LowStockAlerts.tsx
│   │   │   └── InventoryReports.tsx
│   │   ├── hooks/
│   │   │   ├── useInventory.ts
│   │   │   └── useStock.ts
│   │   ├── services/
│   │   │   └── inventoryService.ts
│   │   └── types/
│   │       └── index.ts
│   ├── storage/                     # Storage rooms
│   │   ├── components/
│   │   │   ├── StorageList.tsx
│   │   │   ├── StorageForm.tsx
│   │   │   ├── StorageDashboard.tsx
│   │   │   ├── TemperatureMonitoring.tsx
│   │   │   └── CapacityTracking.tsx
│   │   ├── hooks/
│   │   │   └── useStorage.ts
│   │   ├── services/
│   │   │   └── storageService.ts
│   │   └── types/
│   │       └── index.ts
│   ├── products/                    # Product management
│   │   ├── components/
│   │   │   ├── ProductList.tsx
│   │   │   ├── ProductForm.tsx
│   │   │   ├── CategoryManagement.tsx
│   │   │   └── ProductCatalog.tsx
│   │   ├── hooks/
│   │   │   └── useProducts.ts
│   │   ├── services/
│   │   │   └── productService.ts
│   │   └── types/
│   │       └── index.ts
│   ├── farmers/                     # Farmer management (shared across MCBs)
│   │   ├── components/
│   │   │   ├── FarmerList.tsx
│   │   │   ├── FarmerForm.tsx
│   │   │   ├── FarmerProfile.tsx
│   │   │   └── FarmerReports.tsx
│   │   ├── hooks/
│   │   │   └── useFarmers.ts
│   │   ├── services/
│   │   │   └── farmerService.ts
│   │   └── types/
│   │       └── index.ts
│   └── shared/                      # Shared components across features
│       ├── components/
│       │   ├── QualityGradeBadge.tsx
│       │   ├── DateRangePicker.tsx
│       │   ├── UnitConverter.tsx
│       │   └── DairyMetrics.tsx
│       ├── hooks/
│       │   ├── useDairyData.ts
│       │   └── useQualityStandards.ts
│       ├── utils/
│       │   ├── calculations.ts
│       │   ├── formatters.ts
│       │   └── validators.ts
│       └── constants/
│           ├── qualityStandards.ts
│           ├── units.ts
│           └── roles.ts
│   └── reports/                     # Reporting features
│       ├── components/
│       │   ├── ReportBuilder.tsx
│       │   ├── ChartRenderer.tsx
│       │   ├── DataExporter.tsx
│       │   └── ReportScheduler.tsx
│       ├── hooks/
│       │   └── useReports.ts
│       ├── services/
│       │   └── reportService.ts
│       └── types/
│           └── index.ts
├── lib/                             # Utility libraries
│   ├── auth.ts                      # Authentication utilities
│   ├── api.ts                       # API client configuration
│   ├── utils.ts                     # General utilities
│   ├── constants.ts                 # Application constants
│   ├── validations.ts               # Form validations
│   └── formatters.ts                # Data formatters
├── hooks/                           # Global hooks
│   ├── useAuth.ts
│   ├── useTenant.ts
│   ├── useCompany.ts
│   ├── useLocalStorage.ts
│   └── useDebounce.ts
├── store/                           # Global state management
│   ├── authStore.ts                 # Authentication state
│   ├── tenantStore.ts               # Tenant context
│   ├── companyStore.ts              # Company context
│   └── uiStore.ts                   # UI state
├── types/                           # Global TypeScript types
│   ├── auth.ts
│   ├── api.ts
│   ├── dairy.ts
│   └── common.ts
├── constants/                       # Application constants
│   ├── routes.ts
│   ├── roles.ts
│   └── dairy.ts
└── middleware.ts                    # Next.js middleware
```

## Role-Based Navigation Structure

### System Admin Navigation
```typescript
const systemAdminNav = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Tenants", href: "/admin/tenants" },
  { label: "System Settings", href: "/admin/settings" },
  { label: "Reports", href: "/reports" }
];
```

### Tenant Admin Navigation  
```typescript
const tenantAdminNav = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Companies", href: "/admin/companies" },
  { label: "Users", href: "/admin/users" },
  { label: "Dairy Operations", href: "/dairy" },
  { label: "Reports", href: "/reports" }
];
```

### Tenant Admin Navigation (Enhanced)
```typescript
const tenantAdminNav = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Companies", href: "/admin/companies" },
  { label: "Users", href: "/admin/users" },
  { 
    label: "Operations", 
    children: [
      { label: "MCB Management", href: "/mcb" },
      { label: "Factory", href: "/factory" },
      { label: "Shops", href: "/shops" },
      { label: "Inventory", href: "/inventory" },
      { label: "Storage", href: "/storage" },
      { label: "Products", href: "/products" }
    ]
  },
  { label: "Reports", href: "/reports" }
];
```

### MCB Manager Navigation
```typescript
const mcbManagerNav = [
  { label: "MCB Dashboard", href: "/mcb/[id]/dashboard" },
  { label: "Farmers", href: "/mcb/[id]/farmers" },
  { label: "Daily Collection", href: "/mcb/[id]/collections" },
  { label: "Quality Tests", href: "/mcb/[id]/quality" },
  { label: "Reports", href: "/reports/mcb" }
];
```

### Factory Manager Navigation
```typescript
const factoryManagerNav = [
  { label: "Factory Dashboard", href: "/factory/[id]/dashboard" },
  { label: "Production", href: "/factory/[id]/production" },
  { label: "Batches", href: "/factory/[id]/batches" },
  { label: "Quality Control", href: "/factory/[id]/quality" },
  { label: "Reports", href: "/reports/factory" }
];
```

### Shop Manager Navigation
```typescript
const shopManagerNav = [
  { label: "Shop Dashboard", href: "/shops/[id]/dashboard" },
  { label: "POS System", href: "/shops/[id]/pos" },
  { label: "Sales", href: "/shops/[id]/sales" },
  { label: "Inventory", href: "/shops/[id]/inventory" },
  { label: "Customers", href: "/shops/[id]/customers" },
  { label: "Reports", href: "/reports/shop" }
];
```

## Component Architecture

### Shared Components Usage
```typescript
// Base UI Components (shadcn/ui)
import { Button, Input, Card, Table, Dialog } from "@/components/ui";

// Layout Components  
import { AppLayout, PageHeader } from "@/components/layout";

// Shared Feature Components
import { DataTable, StatsCard, ChartCard } from "@/components/shared";

// Feature-specific Components
import { MCBDashboard, FarmerForm } from "@/features/mcb/components";
```

### State Management Pattern
```typescript
// Global State (Zustand)
import { useAuthStore } from "@/store/authStore";
import { useTenantStore } from "@/store/tenantStore";
import { useCompanyStore } from "@/store/companyStore";

// Feature State (React Query + Local State)
import { useMCB } from "@/features/mcb/hooks/useMCB";
import { useFarmers } from "@/features/farmers/hooks/useFarmers";
```

## Key Pages Structure

### Dashboard Pages (Role-based)
```typescript
// /app/(dashboard)/dashboard/page.tsx
export default function DashboardPage() {
  const { user } = useAuthStore();
  
  switch(user.role) {
    case 'SYSTEM_ADMIN':
      return <SystemAdminDashboard />;
    case 'TENANT_ADMIN':
      return <TenantAdminDashboard />;

    case 'FACTORY_MANAGER':
      return <FactoryManagerDashboard />;
    case 'MCB_MANAGER':
      return <MCBManagerDashboard />;
    case 'SHOP_MANAGER':
      return <ShopManagerDashboard />;
    default:
      return <DefaultDashboard />;
  }
}
```

### MCB Management Page
```typescript
// /app/(dashboard)/mcb/page.tsx  
export default function MCBListPage() {
  return (
    <AppLayout>
      <PageHeader title="Milk Collection Branches" />
      <MCBList />
    </AppLayout>
  );
}
```

### Daily Collection Page
```typescript
// /app/(dashboard)/mcb/[id]/collections/page.tsx
export default function CollectionsPage({ params }: { params: { id: string } }) {
  return (
    <AppLayout>
      <PageHeader title="Daily Collections" />
      <DailyCollectionForm mcbId={params.id} />
      <CollectionHistory mcbId={params.id} />
    </AppLayout>
  );
}
```

## API Integration Pattern

### Service Layer Structure
```typescript
// features/mcb/services/mcbService.ts
export const mcbService = {
  async getMCBs(companyId: string): Promise<MCB[]> {
    const response = await api.get(`/api/v1/mcb?companyId=${companyId}`);
    return response.data;
  },
  
  async createMCB(data: CreateMCBRequest): Promise<MCB> {
    const response = await api.post('/api/v1/mcb', data);
    return response.data;
  },
  
  async updateMCB(id: string, data: UpdateMCBRequest): Promise<MCB> {
    const response = await api.put(`/api/v1/mcb/${id}`, data);
    return response.data;
  }
};
```

### React Query Integration
```typescript
// features/mcb/hooks/useMCB.ts
export function useMCB(companyId: string) {
  return useQuery({
    queryKey: ['mcb', companyId],
    queryFn: () => mcbService.getMCBs(companyId),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useCreateMCB() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: mcbService.createMCB,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mcb'] });
    },
  });
}
```

## Routing & Navigation

### Protected Routes Structure
```typescript
// middleware.ts
export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth-token');
  const { pathname } = request.nextUrl;
  
  // Check authentication
  if (!token && !pathname.startsWith('/login')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  // Role-based access control
  const userRole = getUserRoleFromToken(token);
  
  if (pathname.startsWith('/admin') && !hasAdminAccess(userRole)) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  
  return NextResponse.next();
}
```

## Benefits of New Structure

1. **Simplified Navigation**: No module selection complexity
2. **Role-focused UX**: Each user sees only relevant features  
3. **Domain-driven**: Clear dairy business logic organization
4. **Maintainable**: Feature-based structure for easy development
5. **Scalable**: Easy to add new dairy features
6. **Performance**: Optimized routing and lazy loading
7. **Type Safety**: Comprehensive TypeScript coverage
8. **Modern Stack**: Next.js 14, React Query, Zustand, Tailwind 