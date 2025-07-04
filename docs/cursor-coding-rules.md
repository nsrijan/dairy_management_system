# Cursor Coding Rules - Dairy ERP App

> **Objective**: Maintain clean, modern, whitespace-heavy UI with consistent styling across all components using TailwindCSS.

## 🏗️ Layout and Structure

### Always Use Shared Layout Components

```tsx
// ✅ CORRECT - Use AppLayout for every internal page
import { AppLayout } from '@/components/layout/AppLayout';

export default function MyPage() {
  return (
    <AppLayout title="Page Title" tenantName={tenantName}>
      {/* Page content */}
    </AppLayout>
  );
}

// ❌ WRONG - Never reimplement sidebar/header per page
export default function MyPage() {
  return (
    <div className="flex h-screen">
      <aside>{/* Custom sidebar */}</aside>
      <header>{/* Custom header */}</header>
    </div>
  );
}
```

### Layout Components Rules

- **AppLayout**: Wrap every internal page
- **AppSidebar, AppHeader**: Never duplicate these components
- **Auto role-based navigation**: Layout handles sidebar items automatically
- **Theme and responsive behavior**: Handled by shared components

---

## 🎨 Component Styling Guidelines

### Color Palette
- **Primary**: Blue shades (`bg-blue-600`, `text-blue-700`, `border-blue-200`)
- **Success**: Green shades (`bg-green-100`, `text-green-700`)
- **Background**: Gray shades (`bg-gray-50`, `bg-gray-100`, `bg-gray-800` for dark)
- **Text**: `text-gray-900` (light), `text-white` (dark), `text-gray-600` (secondary)

### Cards and Containers

```tsx
// ✅ CORRECT - Soft card styling
<div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
  {/* Content */}
</div>

// ✅ CORRECT - Entity card with hover
<div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors border border-gray-200 dark:border-gray-700">
  {/* Entity content */}
</div>

// ❌ WRONG - Hard borders, inconsistent padding
<div className="border-2 border-black p-2">
  {/* Content */}
</div>
```

**Card Rules:**
- Use `rounded-xl` for main containers, `rounded-lg` for nested items
- Always include dark mode variants
- Consistent padding: `p-4` or `p-6`
- Soft shadows: `shadow-sm`
- No hard borders - use subtle `border-gray-200`

---

## 📋 Tabs Implementation

### Tab Structure (Follow Dashboard/Company Pages Pattern)

```tsx
// ✅ CORRECT - Enhanced tab styling
<TabsList className="grid w-auto grid-cols-4 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
  <TabsTrigger 
    value="entities" 
    className="flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition-all data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-blue-400"
  >
    <Icon className="h-4 w-4" />
    <span className="hidden sm:inline">Entities</span>
    <Badge variant="secondary" className="ml-1 bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
      {count}
    </Badge>
  </TabsTrigger>
</TabsList>

// ❌ WRONG - Plain tabs without proper styling
<TabsList>
  <TabsTrigger value="entities">Entities</TabsTrigger>
</TabsList>
```

**Tab Rules:**
- Active tabs: Clear visual differentiation with `data-[state=active]` styling
- Include icons and counts with badges
- Responsive: Hide text on small screens (`hidden sm:inline`)
- Consistent spacing: `gap-2`, `px-4 py-3`

---

## 📝 Forms and Modals

### Form Structure

```tsx
// ✅ CORRECT - Consistent form styling
<form onSubmit={handleSubmit} className="space-y-6">
  <div className="space-y-4">
    <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Section Title</h3>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="name">Field Name *</Label>
        <Input
          id="name"
          placeholder="Placeholder text"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          className={errors.name ? 'border-red-500' : ''}
        />
        {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
      </div>
    </div>
  </div>
  
  <DialogFooter>
    <Button type="button" variant="outline" onClick={onCancel}>
      Cancel
    </Button>
    <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700">
      {loading ? (
        <>
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
          Creating...
        </>
      ) : (
        <>
          <Plus className="h-4 w-4 mr-2" />
          Create Item
        </>
      )}
    </Button>
  </DialogFooter>
</form>
```

### Modal Structure

```tsx
// ✅ CORRECT - Modal with proper styling
<Dialog open={open} onOpenChange={setOpen}>
  <DialogTrigger asChild>
    <Button className="bg-blue-600 hover:bg-blue-700 text-white">
      <Plus className="h-4 w-4 mr-2" />
      Add Item
    </Button>
  </DialogTrigger>
  <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
    <DialogHeader>
      <DialogTitle className="flex items-center gap-2">
        <Icon className="h-5 w-5 text-blue-600" />
        Modal Title
      </DialogTitle>
      <DialogDescription>
        Clear description of what this modal does.
      </DialogDescription>
    </DialogHeader>
    {/* Form content */}
  </DialogContent>
</Dialog>
```

**Form Rules:**
- **Spacing**: Use `space-y-6` for form sections, `space-y-4` within sections, `space-y-2` for field groups
- **Labels**: Always above inputs with `htmlFor` attribute
- **Grid Layout**: `grid grid-cols-1 md:grid-cols-2 gap-4` for responsive forms
- **Validation**: Red border (`border-red-500`) and error text below inputs
- **Submit Buttons**: Right-aligned with loading states and icons
- **No Hard Borders**: Use default input styling, not custom borders

---

## 📊 Tables and Lists

### Entity List Pattern

```tsx
// ✅ CORRECT - Entity list styling
<div className="space-y-4">
  {entities.map((entity) => (
    <div key={entity.id} className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <h4 className="font-semibold text-gray-900 dark:text-white">
              {entity.name}
            </h4>
            <Badge variant={entity.isActive ? "default" : "secondary"} className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
              {entity.isActive ? 'Active' : 'Inactive'}
            </Badge>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <Icon className="h-4 w-4 text-gray-500" />
              <span>{entity.value}</span>
            </div>
          </div>
        </div>
        <Button asChild variant="outline" size="sm" className="ml-4 hover:bg-blue-50 hover:text-blue-700 dark:hover:bg-blue-900 dark:hover:text-blue-300">
          <Link href={`/entity/${entity.id}`}>
            <ExternalLink className="h-4 w-4 mr-2" />
            View Details
          </Link>
        </Button>
      </div>
    </div>
  ))}
</div>
```

### Table Structure (When Needed)

```tsx
// ✅ CORRECT - Table with proper styling
<div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
  <table className="w-full">
    <thead className="bg-gray-50 dark:bg-gray-800/50">
      <tr>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          Column Header
        </th>
      </tr>
    </thead>
    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
      <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
          Cell Content
        </td>
      </tr>
    </tbody>
  </table>
</div>
```

**Table/List Rules:**
- Prefer **entity cards** over tables for most use cases
- Use **hover states** for interactive elements
- **Consistent spacing**: `p-4` for cards, `px-6 py-4` for table cells
- **Grid layouts** for responsive information display
- **Soft borders** and subtle hover effects

---

## 🔘 Buttons

### Button Variants

```tsx
// ✅ PRIMARY - Main actions
<Button className="bg-blue-600 hover:bg-blue-700 text-white">
  <Plus className="h-4 w-4 mr-2" />
  Add Item
</Button>

// ✅ SECONDARY - Alternative actions
<Button variant="outline" className="hover:bg-blue-50 hover:text-blue-700 dark:hover:bg-blue-900 dark:hover:text-blue-300">
  <ExternalLink className="h-4 w-4 mr-2" />
  View Details
</Button>

// ✅ DESTRUCTIVE - Delete actions
<Button variant="destructive">
  <Trash2 className="h-4 w-4 mr-2" />
  Delete
</Button>

// ✅ LOADING STATE
<Button disabled={loading}>
  {loading ? (
    <>
      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
      Loading...
    </>
  ) : (
    'Submit'
  )}
</Button>
```

**Button Rules:**
- **Icons**: Always `h-4 w-4` with `mr-2` spacing
- **Loading states**: Spinner with proper messaging
- **Consistent sizing**: Use `size="sm"` for compact areas
- **Hover effects**: Follow color scheme patterns

---

## 📐 Spacing and Layout

### Consistent Spacing Scale

```tsx
// ✅ CORRECT - Consistent spacing
<div className="space-y-6">        {/* Page sections */}
  <div className="space-y-4">      {/* Card sections */}
    <div className="space-y-2">    {/* Field groups */}
      <div className="gap-4">      {/* Grid gaps */}
        <div className="p-6">      {/* Main padding */}
          <div className="p-4">    {/* Nested padding */}
```

### Layout Boundaries

```tsx
// ✅ CORRECT - Page boundaries
<div className="max-w-7xl mx-auto space-y-6">
  {/* Page content */}
</div>

// ✅ CORRECT - Container usage
<div className="container mx-auto px-4">
  {/* Content */}
</div>
```

**Spacing Rules:**
- **Page sections**: `space-y-6`
- **Card sections**: `space-y-4`
- **Field groups**: `space-y-2`
- **Grid gaps**: `gap-4`
- **Padding**: `p-6` for main areas, `p-4` for nested
- **Page bounds**: `max-w-7xl mx-auto` or `container mx-auto`

---

## ♻️ Reusability Guidelines

### Component Organization

```
components/
├── ui/                     # Basic UI components
│   ├── button.tsx
│   ├── input.tsx
│   ├── dialog.tsx
│   └── tabs.tsx
├── layout/                 # Layout components
│   ├── AppLayout.tsx
│   ├── AppSidebar.tsx
│   └── AppHeader.tsx
└── shared/                 # Reusable business components
    ├── StatCard.tsx
    ├── EntityList.tsx
    ├── LoadingSpinner.tsx
    └── ErrorBoundary.tsx

features/
└── [domain]/
    ├── components/         # Domain-specific components
    ├── hooks/             # React Query hooks
    ├── services/          # API calls
    ├── types.ts           # Domain types
    └── utils/             # Domain utilities
```

### Reusable Patterns

```tsx
// ✅ CORRECT - Reusable stat card
interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: 'blue' | 'green' | 'purple' | 'orange';
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

// ✅ CORRECT - Reusable modal form
interface ModalFormProps<T> {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: T) => Promise<void>;
  title: string;
  children: React.ReactNode;
}
```

**Reusability Rules:**
- **Extract common patterns** into shared components
- **Use generics** for type-safe reusable components
- **Follow domain structure** for feature-specific code
- **Reuse types and schemas** across related components

---

## 🔄 Data Fetching Patterns

### Loading States

```tsx
// ✅ CORRECT - Loading skeleton
if (isLoading) {
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 animate-pulse">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
        </div>
      ))}
    </div>
  );
}

// ✅ CORRECT - Error state
if (error) {
  return (
    <div className="text-center py-12">
      <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
        Error Loading Data
      </h3>
      <p className="text-gray-600 dark:text-gray-400 mb-4">
        {error.message}
      </p>
      <Button onClick={refetch}>Try Again</Button>
    </div>
  );
}
```

### Optimistic Updates

```tsx
// ✅ CORRECT - Optimistic update pattern
const handleCreate = async (newItem: CreateItemRequest) => {
  // Optimistically update UI
  const optimisticItem = { ...newItem, id: `temp-${Date.now()}` };
  setItems(prev => [...prev, optimisticItem]);

  try {
    const createdItem = await createItem(newItem);
    // Replace optimistic item with real data
    setItems(prev => prev.map(item => 
      item.id === optimisticItem.id ? createdItem : item
    ));
  } catch (error) {
    // Rollback optimistic update
    setItems(prev => prev.filter(item => item.id !== optimisticItem.id));
    // Show error message
  }
};
```

---

## ♿ Accessibility and Dark Mode

### Dark Mode Support

```tsx
// ✅ ALWAYS include dark mode variants
<div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-200 dark:border-gray-700">
  {/* Content */}
</div>
```

### Accessibility Guidelines

```tsx
// ✅ CORRECT - Proper labels and ARIA
<Label htmlFor="email">Email Address *</Label>
<Input
  id="email"
  type="email"
  aria-describedby="email-error"
  aria-invalid={!!errors.email}
/>
{errors.email && (
  <p id="email-error" className="text-sm text-red-500" role="alert">
    {errors.email}
  </p>
)}

// ✅ CORRECT - Keyboard navigation
<Button
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleAction();
    }
  }}
>
  Action
</Button>
```

---

## 🎯 Quick Reference Checklist

When creating any component, ensure:

- [ ] Uses AppLayout (never custom sidebar/header)
- [ ] Includes dark mode variants for all elements
- [ ] Follows consistent spacing scale (`space-y-6`, `gap-4`, `p-6`)
- [ ] Uses soft styling (rounded-xl, shadow-sm, no hard borders)
- [ ] Implements proper loading and error states
- [ ] Includes accessibility attributes (labels, ARIA)
- [ ] Follows the blue color scheme
- [ ] Uses consistent icon sizing (h-4 w-4, h-5 w-5)
- [ ] Implements hover states and transitions
- [ ] Reuses existing components where possible

---

## ❌ Common Anti-Patterns to Avoid

```tsx
// ❌ DON'T - Custom sidebar/header per page
// ❌ DON'T - Hard borders (border-2, border-black)
// ❌ DON'T - Inconsistent spacing (random margins/padding)
// ❌ DON'T - Missing dark mode variants
// ❌ DON'T - No loading states for async operations
// ❌ DON'T - Cramped layouts without breathing room
// ❌ DON'T - Inconsistent color usage
// ❌ DON'T - Duplicate form/modal logic
// ❌ DON'T - Missing error handling
// ❌ DON'T - Hardcoded colors instead of theme classes
```

---

*This document should be referenced for all new components and updated as patterns evolve.* 