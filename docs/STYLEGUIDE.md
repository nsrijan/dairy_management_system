# UI/UX Style Guide

## #system-overview
- Framework: React + TypeScript + Tailwind CSS + Shadcn/ui
- Theme: Supports both light and dark modes with CSS custom properties
- Primary Brand Color: #9b87f5 (purple/violet)
- Design Philosophy: Clean, modern, professional with subtle animations

## Components

### #card-base
```jsx
// Use Shadcn Card components as base
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Basic card with hover effect
<Card className="hover:shadow-md transition-shadow">
  <CardHeader className="pb-3">
    {/* Header content */}
  </CardHeader>
  <CardContent className="space-y-4">
    {/* Main content */}
  </CardContent>
</Card>
```

### #card-design-principles
- Hover Effects: Always include hover:shadow-md transition-shadow for interactive cards
- Icon Integration:
  - Use circular icon containers: h-10 w-10 bg-brand-primary rounded flex items-center justify-center text-white
  - Icons should be h-5 w-5 inside containers
- Action Buttons:
  - Use ghost variant: variant="ghost" size="sm"
  - Destructive actions: className="text-destructive hover:bg-destructive/10"
- Status Indicators: Use Badge components with appropriate variants
- Content Spacing: Use space-y-4 for consistent vertical spacing

### #card-layout
```jsx
// Header with icon, title, and actions
<CardHeader className="pb-3">
  <div className="flex items-start justify-between">
    <div className="flex items-center gap-3">
      <div className="h-10 w-10 bg-brand-primary rounded flex items-center justify-center text-white">
        <IconComponent className="h-5 w-5" />
      </div>
      <div>
        <CardTitle className="text-lg">{title}</CardTitle>
        <p className="text-sm text-muted-foreground">{subtitle}</p>
      </div>
    </div>
    <div className="flex items-center gap-1">
      {/* Action buttons */}
    </div>
  </div>
</CardHeader>

// Content with proper spacing
<CardContent className="space-y-4">
  <p className="text-sm text-muted-foreground">{description}</p>
  
  {/* Features or tags section */}
  <div>
    <h4 className="text-sm font-medium mb-2">Features</h4>
    <div className="flex flex-wrap gap-1">
      {/* Badge components */}
    </div>
  </div>

  {/* Footer with status and meta info */}
  <div className="flex items-center justify-between pt-2 border-t">
    <div className="flex items-center gap-2">
      {/* Status controls */}
    </div>
    <span className="text-xs text-muted-foreground">
      {/* Meta information */}
    </span>
  </div>
</CardContent>
```

## Forms

### #dialog-form
```jsx
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

<Dialog open={isOpen} onOpenChange={onOpenChange}>
  <DialogContent className="sm:max-w-[600px]">
    <DialogHeader>
      <DialogTitle>{isEdit ? 'Edit Item' : 'Create New Item'}</DialogTitle>
      <DialogDescription>
        {isEdit ? 'Edit the details below.' : 'Fill in the details for the new item.'}
      </DialogDescription>
    </DialogHeader>
    
    <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto">
      {/* Form fields */}
    </div>
    
    <DialogFooter>
      <Button type="submit" onClick={onSubmit} className="bg-brand-primary">
        {isEdit ? 'Save Changes' : 'Create Item'}
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

### #form-fields
```jsx
// Standard field layout (4-column grid)
<div className="grid grid-cols-4 items-center gap-4">
  <Label htmlFor="fieldname" className="text-right">Label</Label>
  <Input
    id="fieldname"
    value={value}
    onChange={onChange}
    className="col-span-3"
    placeholder="Placeholder text"
  />
</div>

// For textarea fields
<div className="grid grid-cols-4 items-center gap-4">
  <Label htmlFor="description" className="text-right">Description</Label>
  <Textarea
    id="description"
    value={value}
    onChange={onChange}
    className="col-span-3"
    placeholder="Brief description"
  />
</div>

// For select fields
<div className="grid grid-cols-4 items-center gap-4">
  <Label htmlFor="select" className="text-right">Select</Label>
  <select
    id="select"
    value={value}
    onChange={onChange}
    className="col-span-3 h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
  >
    <option value="option1">Option 1</option>
  </select>
</div>
```

### #array-fields
```jsx
// For managing arrays (like features)
<div className="grid grid-cols-4 items-start gap-4">
  <Label className="text-right mt-2">Features</Label>
  <div className="col-span-3 space-y-2">
    {array.map((item, index) => (
      <div key={index} className="flex gap-2">
        <Input
          value={item}
          onChange={(e) => updateItem(index, e.target.value)}
          placeholder="Item name"
          className="flex-1"
        />
        {array.length > 1 && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => removeItem(index)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        )}
      </div>
    ))}
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={addItem}
      className="w-full"
    >
      <Plus className="h-4 w-4 mr-2" />
      Add Item
    </Button>
  </div>
</div>
```

## Theme System

### #colors
```css
:root {
  --primary: 258 78% 74%;           /* #9b87f5 */
  --secondary: 260 30% 54%;         /* #7E69AB */
  --background: 0 0% 100%;          /* White */
  --foreground: 222.2 84% 4.9%;     /* Dark text */
  --muted: 210 40% 96.1%;           /* Light gray */
  --muted-foreground: 215.4 16.3% 46.9%;
  --border: 214.3 31.8% 91.4%;
  --destructive: 0 84.2% 60.2%;     /* Red */
}

.dark {
  --background: 222.2 84% 4.9%;     /* Dark background */
  --foreground: 210 40% 98%;        /* Light text */
  --muted: 217.2 32.6% 17.5%;       /* Dark gray */
  /* Other dark mode overrides */
}
```

### #brand-colors
```jsx
// Primary brand color for buttons, icons
className="bg-brand-primary"        // #9b87f5
className="text-brand-primary"

// Secondary for accents
className="bg-brand-secondary"      // #7E69AB

// Use semantic colors for states
className="text-destructive"        // For delete/danger
className="text-muted-foreground"   // For secondary text
```

## Interactions

### #hover-effects
```jsx
// Cards
className="hover:shadow-md transition-shadow"

// Buttons (already built into components)
// Links and interactive elements
className="transition-colors hover:text-primary"
```

### #transitions
```jsx
// For view toggles, use smooth transitions
className="transition-all duration-300"
```

## Best Practices

### #component-rules
- Icons: Always use Lucide React icons, sized h-4 w-4 for buttons, h-5 w-5 for card icons
- Spacing: Use Tailwind's space-y and gap utilities consistently
- Text Hierarchy:
  - text-lg for card titles
  - text-sm for descriptions and meta text
  - text-xs for timestamps and minor details
- Buttons: Use appropriate variants (ghost, outline, default)
- Form Validation: Always include proper labels and accessibility attributes
- Responsive: Use responsive classes (sm:max-w-[600px], md:grid-cols-2)

### #theme-compatibility
Always use CSS custom properties for colors:
- bg-background instead of bg-white
- text-foreground instead of text-black
- text-muted-foreground for secondary text
- border-border for borders

This ensures automatic dark/light theme switching without component changes.