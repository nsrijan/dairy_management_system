# Tenant Management Feature

## Overview

The Tenant Management feature provides a comprehensive dashboard and management system for tenant-level operations in the Dairy Management System. It includes company management, user oversight, and operational dashboards.

## Features

### 🏠 Tenant Dashboard
- **Real-time Statistics**: Companies, users, revenue, and inventory metrics
- **Activity Feed**: Recent system activities with urgency indicators
- **Quick Actions**: Direct access to frequently used features
- **System Status**: Module health monitoring

### 🏢 Company Management
- **CRUD Operations**: Create, read, update, delete companies
- **Search & Filter**: Find companies by name or description
- **Status Management**: Activate/deactivate companies
- **Real-time Updates**: Live data synchronization

### 🎨 UI/UX Features
- **Modern Design**: Clean, professional interface
- **Responsive Layout**: Works on all device sizes
- **Dark Mode Support**: Automatic theme adaptation
- **Loading States**: Smooth user experience
- **Error Handling**: Comprehensive error management

## File Structure

```
web/features/tenant/
├── components/
│   ├── company/
│   │   ├── CompanyManagement.tsx      # Main company management page
│   │   ├── CompanyFormDialog.tsx      # Create/edit company dialog
│   │   └── DeleteCompanyDialog.tsx    # Delete confirmation dialog
│   ├── TenantDashboardContent.tsx     # Main dashboard component
│   └── index.ts                       # Component exports
├── hooks/
│   ├── useCompanies.ts               # React Query hooks for companies
│   └── index.ts                      # Hook exports
├── navigation/
│   └── getTenantNavItems.tsx         # Tenant navigation configuration
├── store/
│   ├── tenantCompanyStore.ts         # Zustand store for company state
│   └── index.ts                      # Store exports
├── types/
│   └── index.ts                      # TypeScript type definitions
├── utils/
│   └── tenantUtils.ts                # Utility functions
├── index.ts                          # Main feature export
└── README.md                         # This documentation
```

## Component Architecture

### Dashboard Components
- **TenantDashboardContent**: Main dashboard with stats, activities, and quick actions
- **StatCard**: Reusable metric display component
- **QuickActions**: Action buttons for common operations

### Company Management Components
- **CompanyManagement**: Main company listing and management
- **CompanyFormDialog**: Modal for creating/editing companies
- **DeleteCompanyDialog**: Confirmation dialog for deletions

## State Management

### React Query (Data Management)
```typescript
// Companies
useCompanies()          // Fetch companies list
useCreateCompany()      // Create new company
useUpdateCompany()      // Update existing company
useDeleteCompany()      // Delete company
```

### Zustand Store (UI State)
```typescript
// Dialog states
isCreateDialogOpen, setCreateDialogOpen
isEditDialogOpen, setEditDialogOpen
isDeleteDialogOpen, setDeleteDialogOpen

// Selected data
selectedCompany, setSelectedCompany

// Search/filter
searchTerm, setSearchTerm
```

## API Integration

### Endpoints Used
- `GET /api/v1/companies` - Fetch companies
- `POST /api/v1/admin/companies` - Create company
- `PUT /api/v1/admin/companies/{id}` - Update company
- `DELETE /api/v1/admin/companies/{id}` - Delete company

### Error Handling
- Network errors with retry logic
- Validation errors with field-level feedback
- Toast notifications for success/error states
- Graceful degradation for offline scenarios

## Styling & Theming

### Design System
- **Colors**: Teal primary with semantic color variations
- **Typography**: Inter font with responsive sizing
- **Spacing**: Consistent 4px grid system
- **Shadows**: Layered depth with appropriate elevation

### Responsive Design
- **Mobile**: Single column layout, stacked components
- **Tablet**: Two-column grid, collapsed sidebar
- **Desktop**: Three-column grid, full sidebar

## Usage Examples

### Basic Usage
```tsx
import { TenantDashboardContent } from '@/features/tenant';

export default function TenantPage() {
    return <TenantDashboardContent />;
}
```

### Company Management
```tsx
import { CompanyManagement } from '@/features/tenant';

export default function CompaniesPage() {
    return <CompanyManagement />;
}
```

### Using Hooks
```tsx
import { useCompanies, useCreateCompany } from '@/features/tenant';

function MyComponent() {
    const { companies, isLoading } = useCompanies();
    const createCompany = useCreateCompany();
    
    const handleCreate = async (data) => {
        await createCompany.mutateAsync(data);
    };
    
    return (
        // Component JSX
    );
}
```

## Development Guidelines

### Adding New Features
1. Create component in appropriate subfolder
2. Add types to `types/index.ts`
3. Create hooks if API interaction needed
4. Update store if local state required
5. Export from index files
6. Update documentation

### Code Standards
- Use TypeScript for all files
- Follow React hooks best practices
- Implement proper error boundaries
- Include loading and error states
- Write comprehensive prop types

### Testing
- Unit tests for utility functions
- Component testing with React Testing Library
- Integration tests for API hooks
- E2E tests for critical user flows

## Deployment

### Environment Variables
```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

### Build Considerations
- Code splitting by route
- Lazy loading for heavy components
- Optimized bundle size
- Service worker caching

## Troubleshooting

### Common Issues
1. **Authentication Errors**: Ensure token is valid and user has tenant role
2. **Loading States**: Check network connectivity and API endpoints
3. **Type Errors**: Verify interface definitions match API responses
4. **State Sync**: Ensure React Query cache invalidation is working

### Debug Mode
Enable debug logging by setting:
```typescript
const DEBUG = process.env.NODE_ENV === 'development';
```

## Contributing

1. Follow the established file structure
2. Maintain consistency with existing patterns
3. Add comprehensive TypeScript types
4. Include proper error handling
5. Update documentation for new features
6. Test on multiple screen sizes and themes

## Future Enhancements

- [ ] Advanced filtering and sorting
- [ ] Bulk operations for companies
- [ ] Export functionality
- [ ] Advanced analytics dashboard
- [ ] Real-time notifications
- [ ] Audit logging
- [ ] Role-based permissions
- [ ] Multi-tenant switching 