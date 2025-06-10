# Frontend Project Structure

## Overview

The frontend project follows a feature-based architecture where each feature is organized under the `features` directory. This structure helps maintain separation of concerns and makes the codebase more maintainable.

## Directory Structure

```
web/
├── app/                    # Next.js app directory (pages, layouts)
├── components/            # Shared UI components
│   ├── ui/               # Base UI components (buttons, inputs, etc.)
│   └── shared/           # Shared feature components
├── features/             # Feature-based modules
│   ├── admin/           # Admin-related features
│   │   ├── tenants/     # Tenant management feature
│   │   │   ├── components/  # React components
│   │   │   │   ├── details/  # Tenant details components
│   │   │   │   └── list/     # Tenant list components
│   │   │   ├── services/    # API services
│   │   │   └── types/      # TypeScript types/interfaces
│   │   └── users/      # User management feature
│   └── dashboard/      # Dashboard feature
├── hooks/              # Shared custom hooks
├── lib/               # Utility functions and configurations
├── public/            # Static assets
└── styles/            # Global styles
```

## Feature Structure Example

When creating a new feature, follow this structure:

```
features/
└── admin/
    └── tenants/                  # Feature name
        ├── components/           # React components
        │   ├── TenantList.tsx   # Main list component
        │   ├── TenantForm.tsx   # Form component
        │   └── admin/           # Sub-feature components
        │       ├── AdminList.tsx
        │       └── AdminForm.tsx
        ├── services/            # API services
        │   └── tenantService.ts
        └── types/              # TypeScript types
            └── index.ts
```

## Guidelines

1. **Feature Organization**:
   - Each major feature should be under its own directory in `features/`
   - Related sub-features should be grouped together (e.g., `admin/tenants`)
   - Keep components specific to a feature within that feature's directory

2. **Component Structure**:
   - Place shared components in `components/shared/`
   - Keep UI primitives in `components/ui/`
   - Feature-specific components go in the feature's `components/` directory

3. **Service Layer**:
   - API services should be in the feature's `services/` directory
   - Shared services go in `lib/services/`

4. **Types and Interfaces**:
   - Feature-specific types go in the feature's `types/` directory
   - Shared types go in `lib/types/`

5. **Testing**:
   - Test files should be co-located with the code they test
   - Use `.test.ts` or `.spec.ts` suffix for test files

## Example Usage

When creating a new feature:

1. Create the feature directory structure:
```bash
mkdir -p features/admin/my-feature/{components,services,types}
```

2. Create the necessary files:
```bash
touch features/admin/my-feature/components/MyFeatureList.tsx
touch features/admin/my-feature/services/myFeatureService.ts
touch features/admin/my-feature/types/index.ts
```

3. Export types and components:
```typescript
// features/admin/my-feature/types/index.ts
export interface MyFeatureData {
  id: string;
  name: string;
}

// features/admin/my-feature/components/index.ts
export { default as MyFeatureList } from './MyFeatureList';
``` 