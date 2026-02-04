# TASK T015: Create Admin Layout - OUTPUT

## Summary
Created protected admin dashboard with navigation and authentication checks.

## Files Created

### 1. /src/lib/auth.ts
- Added `isAdmin()` function to check if user email is in ADMIN_EMAILS allowlist
- Added `requireAdmin()` function that throws error if not admin
- Uses Clerk's `currentUser()` for server-side auth checks

### 2. /src/app/admin/layout.tsx
- Protected admin layout with server-side auth check
- Redirects to `/sign-in` if not authenticated
- Redirects to `/dashboard` if authenticated but not admin
- Top bar with "Printguys Admin" branding, "View Site" link, and UserButton
- Sidebar navigation with 7 sections:
  - Dashboard (/admin)
  - Orders (/admin/orders)
  - Customers (/admin/customers)
  - Designs (/admin/designs)
  - Messages (/admin/messages)
  - Analytics (/admin/analytics)
  - Settings (/admin/settings)

### 3. /src/app/admin/page.tsx
- Admin dashboard overview page
- Stats grid showing:
  - Total Revenue (sum of non-canceled orders)
  - Total Orders (with today's count)
  - Total Customers (registered users)
  - Pending Orders (need attention)
- Recent Orders table showing last 5 orders with order number, customer email, amount, and status badge

## Middleware Notes
Existing middleware at `/src/middleware.ts` already requires authentication for non-public routes including `/admin`. Combined with the layout's admin check, this provides:
1. Clerk authentication (middleware)
2. Admin authorization (layout)

## Admin Access
Only users with these emails can access:
- nick@printguys.ca
- admin@printguys.ca

TASK_COMPLETED
