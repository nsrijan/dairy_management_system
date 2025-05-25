# Hierarchical Dashboard Architecture

## Overview

This document outlines our approach to building and maintaining a scalable dashboard system that supports multiple business domains (dairy, pottery, electronics, etc.) and role-specific views within each domain (admin, manager, farmer, supplier, etc.).

## Dashboard Hierarchy

Our application has a multi-level dashboard hierarchy:

1. **System Level** - For tenant managers/software owners (admin)
2. **Domain Level** - For different business domains (dairy, pottery, electronics)
3. **Role Level** - For entity-specific dashboards within domains (farmer, supplier in dairy)

## Architectural Pattern: Registry-Based Approach

We use a registry pattern to manage the growing complexity of multiple dashboard types while maintaining a clean, maintainable codebase.

### 1. Dashboard Registry

The registry maps domain+role combinations to their specific dashboard components:

```typescript
// Dashboard registry example
const dashboardRegistry = {
  // System level
  ADMIN: {
    default: AdminDashboard,
  },
  
  // Domain level with roles
  DAIRY: {
    default: DairyManagerDashboard,
    FARMER: DairyFarmerDashboard,
    SUPPLIER: DairySupplierDashboard,
  },
  
  POTTERY: {
    default: PotteryManagerDashboard,
    ARTISAN: PotteryArtisanDashboard,
  },
  
  // Future domains can be added here
};

// Dashboard resolver function
function resolveDashboard(domain, role) {
  if (!dashboardRegistry[domain]) {
    return GenericDashboard; // Fallback
  }
  
  return dashboardRegistry[domain][role] || dashboardRegistry[domain].default;
}
```

### 2. Common Dashboard Framework

All dashboards use a standardized shell that provides consistent layout and behavior:

```tsx
// DashboardShell.tsx
function DashboardShell({ domain, role, user }) {
  const DashboardComponent = resolveDashboard(domain, role);
  
  return (
    <div className="dashboard-container">
      <CommonHeader user={user} domain={domain} />
      <DashboardComponent user={user} />
      <CommonFooter />
    </div>
  );
}
```

### 3. Dashboard Resolution in Application

The main entry point uses context and user data to determine the appropriate dashboard:

```tsx
// Dashboard page component
export default function DashboardPage() {
  const { user } = useAuth();
  const { domain, role } = useDomainContext();
  
  // For admin/tenant manager showing the system dashboard
  if (user.role === 'SUPER_ADMIN' || user.role === 'TENANT_MANAGER') {
    return <AdminDashboard user={user} />;
  }
  
  // For domain-specific users
  return <DashboardShell domain={domain} role={role} user={user} />;
}
```

## Directory Structure

```
/features
  /dashboard                # Common dashboard framework
    /components
      DashboardShell.tsx    # Main dashboard container
      registry.ts           # Dashboard registry
    /widgets                # Shared dashboard widgets
      StatCard.tsx
      ChartCard.tsx
  
  /domains                  # Domain-specific implementations
    /admin                  # System admin dashboards
      /components
        AdminDashboard.tsx
        /panels
          TenantStatsPanel.tsx
          SystemStatsPanel.tsx
    
    /dairy                  # Dairy domain
      /components
        /dashboard
          DairyManagerDashboard.tsx
          DairyFarmerDashboard.tsx
        /panels
          MilkProductionPanel.tsx
          AnimalHealthPanel.tsx
    
    /pottery                # Pottery domain
      /components
        /dashboard
          PotteryManagerDashboard.tsx
          PotteryArtisanDashboard.tsx
        /panels
          InventoryPanel.tsx
          KilnStatusPanel.tsx
```

## Component Structure

Each dashboard is composed of several layers of components:

1. **Base Widgets**: Reusable across all domains (StatCard, ChartCard)
2. **Domain-Specific Widgets**: Specialized for a particular domain
3. **Dashboard Panels**: Groups of widgets with related functionality
4. **Dashboard Layouts**: Complete dashboard views that assemble panels

## Adding New Domains

To add a new domain:

1. Create a new domain directory in `/features/domains`
2. Implement domain-specific dashboard components and panels
3. Add the domain to the dashboard registry in `registry.ts`

Example for adding a new "Electronics" domain:

```typescript
// In registry.ts
const dashboardRegistry = {
  // Existing domains...
  
  ELECTRONICS: {
    default: ElectronicsManagerDashboard,
    TECHNICIAN: ElectronicsTechnicianDashboard,
  },
};
```

## Adding New Roles

To add a new role to an existing domain:

1. Create a role-specific dashboard component in the domain directory
2. Add the role to the domain entry in the dashboard registry

```typescript
// In registry.ts
const dashboardRegistry = {
  DAIRY: {
    default: DairyManagerDashboard,
    FARMER: DairyFarmerDashboard,
    SUPPLIER: DairySupplierDashboard,
    DISTRIBUTOR: DairyDistributorDashboard, // New role
  },
};
```

## Shared vs. Domain-Specific Components

We follow these guidelines for component placement:

1. **Shared Components**: If a component will be used across multiple domains, place it in the common `/features/dashboard` directory
2. **Domain-Specific Components**: If a component is only relevant to one domain, place it in that domain's directory
3. **Composition**: Domain-specific dashboards should compose shared components where possible

## Benefits of This Architecture

1. **Scalability**: Easy to add new domains and roles without affecting existing code
2. **Maintainability**: Clear separation of concerns and organized structure
3. **Performance**: Only load the components needed for a specific domain/role
4. **Team Collaboration**: Different teams can work on different domains simultaneously
5. **Consistency**: Shared framework ensures unified user experience
6. **Adaptability**: Flexible enough to accommodate diverse business requirements

## Practical Implementation Example

For a dairy farmer dashboard:

```tsx
// DairyFarmerDashboard.tsx
export function DairyFarmerDashboard({ user }) {
  return (
    <div className="dashboard-grid">
      {/* Common widgets that all dashboards might use */}
      <WelcomePanel userName={user.name} />
      
      {/* Domain-specific panels */}
      <MilkProductionPanel farmerId={user.id} />
      <AnimalHealthPanel farmerId={user.id} />
      <FeedInventoryPanel farmerId={user.id} />
      
      {/* Role-specific activity feed */}
      <ActivityFeed 
        domain="DAIRY" 
        role="FARMER" 
        userId={user.id} 
      />
    </div>
  );
}
```

## Conclusion

This hierarchical dashboard architecture provides a scalable, maintainable solution for our multi-domain, multi-role application. By using a registry-based approach with a common framework, we can efficiently manage complexity while providing tailored experiences for each user type. 