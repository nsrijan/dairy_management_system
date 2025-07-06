# MCB Form Documentation

> **Comprehensive guide for the Milk Collection Branch (MCB) creation form**

## 📋 Overview

The MCB Form is a multi-section, professional form component used to create new Milk Collection Branches within the dairy management system. It follows modern UI/UX principles and provides comprehensive validation and user feedback.

### Key Features
- **4 Main Sections**: Branch Info, Manager Details, Pricing, Chill Vats
- **Real-time Validation**: Form-level and field-level validation with clear error messages
- **Progressive Enhancement**: Form progress indicator and contextual help
- **Dynamic Fields**: Expandable chill vats section with capacity calculations
- **Professional Design**: Modern card-based layout with consistent styling
- **Accessibility**: WCAG compliant with proper ARIA labels and keyboard navigation

---

## 🎨 Design System

### Visual Hierarchy
```
Page Layout
├── Gradient Background (blue-50 to indigo-50)
├── Container (max-w-5xl, centered)
├── Header Section
│   ├── Back Button + Title
│   ├── Progress Indicator
│   └── Info Alert
└── Form Sections (Cards)
    ├── Branch Information
    ├── Manager Details  
    ├── Pricing Configuration
    └── Chill Vats Setup
```

### Color Palette
- **Primary**: Blue (#2563eb)
- **Success**: Green (#059669)
- **Warning**: Amber (#d97706)
- **Error**: Red (#dc2626)
- **Background**: Gradient from blue-50 to indigo-50
- **Cards**: White/80% opacity with backdrop blur

### Typography
- **Headers**: text-3xl, font-bold
- **Section Titles**: text-xl, font-semibold
- **Labels**: text-base, font-medium
- **Descriptions**: text-sm, text-gray-600
- **Inputs**: text-base, h-11

---

## 🏗️ Technical Architecture

### Component Structure
```typescript
interface AddMCBFormProps {
    companyId?: string; // Optional company context
}

// Main component with 4 key sections
export function AddMCBForm({ companyId }: AddMCBFormProps)
```

### Form Schema (Zod Validation)
```typescript
const mcbFormSchema = z.object({
    // Branch Information
    branchName: z.string().min(3).max(100).regex(/^[a-zA-Z0-9\s\-_.]+$/),
    location: z.string().min(5).max(200),
    phoneNumber: z.string().regex(/^\+977[0-9]{10}$/),
    isActive: z.boolean(),
    
    // Manager Details
    managerName: z.string().min(2).max(100).regex(/^[a-zA-Z\s]+$/),
    managerUsername: z.string().min(3).max(50).regex(/^[a-zA-Z0-9_]+$/),
    managerPassword: z.string().min(8).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/),
    
    // Pricing Configuration
    rawMilkBuyRate: z.number().min(0.01).max(1000),
    rawMilkSaleRate: z.number().min(0.01).max(1000),
    wholeMilkBuyRate: z.number().min(0.01).max(1000),
    wholeMilkSaleRate: z.number().min(0.01).max(1000),
    
    // Chill Vats (Dynamic Array)
    chillVats: z.array(z.object({
        name: z.string().min(1).max(50),
        capacity: z.number().min(100).max(50000),
    })).min(1).max(20).refine(/* unique names */)
})
.refine(/* sale >= buy rates */)
```

### State Management
```typescript
// React Hook Form with Zod resolver
const form = useForm<MCBFormData>({
    resolver: zodResolver(mcbFormSchema),
    defaultValues: { /* sensible defaults */ },
    mode: 'onChange', // Real-time validation
});

// Dynamic array handling for chill vats
const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'chillVats',
});
```

---

## 📊 Form Sections Detailed

### 1. Branch Information Section
**Purpose**: Basic branch identification and contact details

**Fields**:
- **Branch Name*** (text): 3-100 chars, alphanumeric + spaces/hyphens
- **Location*** (text): 5-200 chars, detailed address
- **Phone Number*** (text): +977XXXXXXXXXX format (Nepal)
- **Status** (switch): Active/Inactive toggle

**Validation Rules**:
- Branch name must be unique within company
- Location should be detailed enough for logistics
- Phone number strictly follows Nepal format (+977 + 10 digits)

**UI Features**:
- Real-time character count
- Format hints for phone number
- Visual status indicator with icons

### 2. Manager Details Section
**Purpose**: Create manager account for branch access

**Fields**:
- **Manager Name*** (text): 2-100 chars, letters and spaces only
- **Username*** (text): 3-50 chars, alphanumeric + underscores
- **Password*** (password): Min 8 chars, mixed case + numbers

**Validation Rules**:
- Name format validation (no numbers/special chars)
- Username uniqueness check (future implementation)
- Strong password requirements enforced
- No spaces in username

**UI Features**:
- Password strength indicator
- Show/hide password toggle
- Username availability check (placeholder)
- Real-time validation feedback

### 3. Pricing Configuration Section
**Purpose**: Set buy/sell rates for milk types

**Structure**: Table layout with milk types and rates

**Milk Types**:
- **Raw Milk**: Basic unprocessed milk
- **Whole Milk**: Full-fat processed milk

**Fields per Type**:
- **Buy Rate*** (number): 0.01-1000 NPR/liter
- **Sale Rate*** (number): 0.01-1000 NPR/liter

**Calculated Values**:
- **Profit Margin**: ((sale - buy) / buy) × 100%

**Validation Rules**:
- Sale rate ≥ Buy rate (enforced at schema level)
- Reasonable rate ranges (0.01-1000)
- Positive values only

**UI Features**:
- Real-time profit margin calculation
- Visual profit indicators with badges
- Currency formatting (NPR)
- Responsive table layout

### 4. Chill Vats Configuration Section
**Purpose**: Define storage capacity and vat management

**Dynamic Fields**: 1-20 vats allowed

**Fields per Vat**:
- **Vat Name*** (text): 1-50 chars, descriptive name
- **Capacity*** (number): 100-50,000 liters

**Validation Rules**:
- Minimum 1 vat required
- Maximum 20 vats allowed
- Vat names must be unique within branch
- Capacity range enforced

**UI Features**:
- Real-time total capacity calculation
- Visual vat numbering
- Add/remove vat functionality
- Capacity summary display
- Progress indicators (X/20 vats)

---

## 🔧 Advanced Features

### Form Progress Indicator
```typescript
const getFormProgress = () => {
    const fields = form.watch();
    let filledFields = 0;
    let totalFields = 11; // Total required fields
    
    // Check each required field
    if (fields.branchName) filledFields++;
    if (fields.location) filledFields++;
    // ... continue for all fields
    
    return Math.round((filledFields / totalFields) * 100);
};
```

### Real-time Calculations
```typescript
// Profit margin calculation
const calculateProfitMargin = (buyRate: number, saleRate: number) => {
    if (buyRate > 0) {
        return (((saleRate - buyRate) / buyRate) * 100).toFixed(1);
    }
    return '0.0';
};

// Total capacity calculation
const calculateTotalCapacity = () => {
    return fields.reduce((total, _, index) => {
        const capacity = form.watch(`chillVats.${index}.capacity`);
        return total + (capacity || 0);
    }, 0);
};
```

### Context-Aware Navigation
```typescript
// Determine back URL based on context
const backUrl = companyId 
    ? `/companies/${companyId}` 
    : '/features/mcb/list';

// Redirect after successful creation
if (companyId) {
    router.push(`/companies/${companyId}?tab=mcbs`);
} else {
    router.push('/features/mcb/list');
}
```

---

## 🎯 UX Enhancements

### Visual Feedback
- **Progress Bar**: Shows completion percentage
- **Section Icons**: Visual identification of sections
- **Status Badges**: Clear active/inactive indicators
- **Error States**: Red borders and descriptive messages
- **Success States**: Green indicators and confirmation

### Accessibility Features
- **Keyboard Navigation**: Full tab order support
- **Screen Reader**: Proper ARIA labels and descriptions
- **High Contrast**: Dark mode support
- **Focus Management**: Clear focus indicators
- **Error Announcements**: Screen reader compatible

### Loading States
- **Form Submission**: Spinner with progress text
- **Disabled States**: All inputs disabled during submission
- **Button States**: Loading spinner in submit button
- **Optimistic UI**: Immediate feedback on actions

### Responsive Design
- **Mobile First**: Optimized for small screens
- **Breakpoints**: sm, md, lg responsive grid
- **Touch Targets**: Minimum 44px touch targets
- **Readable Text**: Appropriate font sizes across devices

---

## 🚀 Implementation Guidelines

### File Structure
```
web/features/mcb/components/
├── AddMCBForm.tsx          # Main form component
├── MCBFormSections/        # Individual section components
│   ├── BranchInfoSection.tsx
│   ├── ManagerSection.tsx
│   ├── PricingSection.tsx
│   └── ChillVatsSection.tsx
└── hooks/
    ├── useMCBForm.ts       # Form logic hook
    └── useMCBValidation.ts # Validation helpers
```

### Route Structure
```
/companies/[id]/mcb/new     # Company context
/features/mcb/add           # Global context (selector)
```

### Dependencies
```json
{
    "react-hook-form": "^7.x.x",
    "@hookform/resolvers": "^3.x.x",
    "zod": "^3.x.x",
    "@radix-ui/react-*": "^1.x.x",
    "tailwindcss": "^3.x.x"
}
```

---

## 📈 Performance Considerations

### Form Optimization
- **Debounced Validation**: Reduce validation calls
- **Memoized Calculations**: Cache expensive computations
- **Lazy Loading**: Load sections on demand
- **Bundle Splitting**: Separate form components

### Memory Management
- **Cleanup**: Proper form reset on unmount
- **Event Listeners**: Remove event listeners
- **Watch Optimization**: Minimize form.watch() calls

---

## 🧪 Testing Strategy

### Unit Tests
```typescript
// Form validation tests
describe('MCB Form Validation', () => {
    test('validates branch name format', () => { ... });
    test('enforces phone number format', () => { ... });
    test('requires sale rate >= buy rate', () => { ... });
    test('validates unique vat names', () => { ... });
});

// Calculation tests
describe('Form Calculations', () => {
    test('calculates profit margin correctly', () => { ... });
    test('sums total vat capacity', () => { ... });
    test('tracks form progress accurately', () => { ... });
});
```

### Integration Tests
```typescript
// Form submission tests
describe('MCB Form Submission', () => {
    test('submits valid form data', () => { ... });
    test('handles API errors gracefully', () => { ... });
    test('redirects on successful creation', () => { ... });
});

// User interaction tests
describe('Form Interactions', () => {
    test('adds and removes vats', () => { ... });
    test('shows/hides password', () => { ... });
    test('calculates values in real-time', () => { ... });
});
```

### E2E Tests
```typescript
// Complete user workflows
describe('MCB Creation Flow', () => {
    test('creates MCB from company page', () => { ... });
    test('creates MCB from global context', () => { ... });
    test('handles form validation errors', () => { ... });
    test('confirms successful creation', () => { ... });
});
```

---

## 🔮 Future Enhancements

### Phase 2 Features
- **Multi-step Wizard**: Break form into steps
- **Draft Saving**: Auto-save form progress
- **Bulk Operations**: Import multiple MCBs
- **Template System**: Save common configurations

### Advanced Functionality
- **Geolocation**: Auto-populate location
- **Photo Upload**: Branch photos
- **QR Code**: Generate branch QR codes
- **Integration**: Connect with mapping services

### Analytics & Insights
- **Form Analytics**: Track completion rates
- **Error Analytics**: Common validation failures
- **User Behavior**: Heat maps and interactions
- **Performance Monitoring**: Load times and errors

---

## 📚 Additional Resources

### Related Documentation
- [Form Design Guidelines](./form-design-guidelines.md)
- [Validation Patterns](./validation-patterns.md)
- [Component Library](./component-library.md)
- [API Integration](./api-integration.md)

### External References
- [React Hook Form Documentation](https://react-hook-form.com/)
- [Zod Validation Library](https://zod.dev/)
- [Radix UI Components](https://www.radix-ui.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)

---

*Last Updated: December 2024*
*Version: 1.0.0*
*Maintainer: Development Team* 