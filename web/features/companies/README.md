# Companies Feature

This directory contains all the company-related functionality following the domain structure pattern.

## Directory Structure

```
features/companies/
├── services/companyService.ts    # API calls and data fetching
├── hooks/useCompanies.ts         # React Query hooks for state management
├── components/                   # Company-related UI components
│   ├── CompanyList.tsx          # List view of companies
│   ├── CompanyManagement.tsx    # Main management component
│   ├── CompanyFormDialog.tsx    # Create/Edit form dialog
│   ├── DeleteCompanyDialog.tsx  # Delete confirmation dialog
│   ├── details/                 # Company details components
│   │   └── CompanyDetails.tsx   # Detailed view of a single company
│   └── index.ts                 # Component exports
├── types.ts                     # TypeScript type definitions
├── utils/                       # Utility functions
│   └── index.ts                # Company-related utilities
└── README.md                   # This file
```

## Types

All company-related types are defined in `types.ts`:

- `Company` - Base company entity
- `CreateCompanyRequest` - Data for creating a new company
- `UpdateCompanyRequest` - Data for updating an existing company
- `CompanyDetails` - Extended company with additional details
- `CompanyStats` - Statistics about company usage
- `CompanyDepartment` - Department within a company
- `CompanyUser` - User belonging to a company

## Services

The `companyService.ts` provides two service objects:

### `companyService`
For tenant-specific company operations:
- `getCompanies(token)` - Get companies for current tenant
- `getCompanyById(token, id)` - Get specific company details
- `createCompany(token, data)` - Create new company
- `updateCompany(token, id, data)` - Update existing company
- `deleteCompany(token, id)` - Delete company

### `adminCompanyService`
For system admin operations across all tenants:
- `getAllCompanies(token)` - Get all companies in system
- `getCompanyById(token, id)` - Get company details (admin view)
- `createCompany(token, data)` - Create company (admin)
- `updateCompany(token, id, data)` - Update company (admin)
- `deleteCompany(token, id)` - Delete company (admin)

## Hooks

The `useCompanies.ts` provides React Query hooks:

- `useCompanies()` - Fetch companies list
- `useCompanyDetails(companyId)` - Fetch specific company details
- `useCreateCompany()` - Mutation for creating companies
- `useUpdateCompany()` - Mutation for updating companies
- `useDeleteCompany()` - Mutation for deleting companies

## Components

### CompanyList
Displays a list of companies with status indicators, action buttons, and responsive design.

### CompanyDetails
Comprehensive company details page with:
- Company information header
- Status and activity stats
- Tabbed interface for different views:
  - Overview - Basic company information
  - Users - Company user management (placeholder)
  - Departments - Department management (placeholder)
  - Settings - Company settings (placeholder)

### CompanyManagement
Main component that orchestrates company list, creation, editing, and deletion.

### CompanyFormDialog
Modal dialog for creating and editing companies with form validation.

### DeleteCompanyDialog
Confirmation dialog for company deletion with loading states.

## Usage

### Basic Company List
```tsx
import { CompanyManagement } from '@/features/companies/components';

export default function CompaniesPage() {
    return <CompanyManagement />;
}
```

### Company Details Page
```tsx
import { CompanyDetails } from '@/features/companies/components';

export default function CompanyDetailsPage({ params }: { params: { id: string } }) {
    return <CompanyDetails companyId={params.id} />;
}
```

### Using Hooks Directly
```tsx
import { useCompanies, useCompanyDetails } from '@/features/companies/hooks/useCompanies';

function MyComponent() {
    const { data: companies, isLoading } = useCompanies();
    const { data: company } = useCompanyDetails('company-id');
    
    // Use the data...
}
```

## Utilities

The `utils/index.ts` provides helper functions:

- `formatCompanyStatus(isActive)` - Format status as string
- `getCompanyStatusColor(isActive)` - Get status color for UI
- `calculateDaysActive(createdAt)` - Calculate days since creation
- `formatCompanyDate(dateString)` - Format dates for display
- `getCompanyInitials(companyName)` - Generate initials for avatars
- `validateCompanyName(name)` - Validate company name
- `generateMockStats(company)` - Generate mock statistics (temporary)

## Styling

All components use:
- Tailwind CSS for styling
- shadcn/ui components for consistency
- Dark mode support
- Responsive design patterns
- Loading states and error handling

## Future Enhancements

The structure is designed to easily accommodate:
- Real-time updates via WebSocket
- Advanced filtering and search
- Bulk operations
- Export functionality
- Company analytics and reporting
- Department and user management integration 