# Project Context: Multi-role Dairy + Shop SaaS System

## Overview
This is a multi-tenant SaaS platform for managing a dairy business, shop POS, and related operational domains (e.g., raw materials, inventory, milk collection, daily shop summary, etc.).

Users log in via subdomain-based tenant routing (`abc.modulelinks.com`). Each tenant can have multiple companies. Each user has one role, and the backend controls all role-permission logic.

---

## Frontend Stack
- Framework: **Next.js App Router**
- State Management: **Redux Toolkit or Zustand**
- Auth: JWT-based (token stored in secure cookie/localStorage)
- Role/Permission: Fetched from backend (`/auth/me`)
- Pages are grouped by **feature**, not by **role**

---

## Routing Convention

| Feature                        | Route Example                          |
|--------------------------------|----------------------------------------|
| Dashboard                     | `/dashboard`                          |
| Milk Collection Branches      | `/milk-collection-branches`           |
| Storage Vats                  | `/storage-vats`                       |
| Raw Materials                 | `/raw-materials`                      |
| Shop Daily Summary            | `/shop/daily-summary/[date]`          |
| Shop POS Page                 | `/shop/sales`                         |

All features are under `app/` and structured by **feature**, not role.  
Roles only influence what actions a user can perform on those pages.

---

## Roles and Permissions (Backend Source of Truth)

Roles include:
- TENANT_ADMIN
- COMPANY_ADMIN
- BRANCH_MANAGER
- SHOP_RECEPTIONIST
- SHOP_MANAGER
- FARMER, SUPPLIER, etc.

The backend returns permissions per feature in the format:

```json
{
  "role": "SHOP_MANAGER",
  "permissions": {
    "storage-vats": { "canView": true, "canEdit": true },
    "shop-daily-summary": { "canView": true, "canEdit": true }
  }
}
```

This data is fetched once during login and stored in frontend global state.

---

## Permission Handling Strategy

- ❌ No hardcoded `if (role)` logic everywhere
- ✅ Use `usePermission(featureKey)` hook to check permissions from global state
- ✅ Pages check `canView`, `canEdit`, etc.
- ✅ Buttons/components use `editable` or `authorized` flags
- ✅ All critical permissions **must** be enforced in backend with annotations like `@PreAuthorize`

---

## Example Pattern

```tsx
const { canView, canEdit } = usePermission('storage-vats');
if (!canView) return <Unauthorized />;

return (
  <VatTable vats={data} editable={canEdit} />
);
```

---

## Folder Structure Pattern

```bash
app/
├── dashboard/
│   └── page.tsx
├── milk-collection-branches/
│   └── page.tsx
├── storage-vats/
│   └── page.tsx
├── shop/
│   ├── daily-summary/
│   │   ├── [date]/page.tsx
│   │   └── page.tsx
│   └── sales/
│       └── page.tsx
├── layout.tsx
```

---

## Middleware Usage

Middleware is used to:
- ✅ Redirect users to their role-specific start pages after login
- ✅ Block access to protected routes for unauthorized users
- ✅ Guard entire folders (e.g., `/admin`) globally

Middleware **does not enforce feature-level permissions**, which are still handled in page code and backend.

Example:

```ts
// middleware.ts
if (!userHasAccessTo(path, role)) {
  return NextResponse.redirect("/unauthorized");
}
```

---

## Summary

- ✅ Features are grouped by functionality (not by role)
- ✅ Permissions are dynamic, backend-driven, stored in global state
- ✅ Frontend uses `usePermission()` for clean checks
- ✅ Backend handles true enforcement via Spring Security
- ✅ Middleware is used only for high-level redirects/guards