TASK_COMPLETED

I've updated the order status functionality in the Printguys admin. Here's what was done:

**API Route** (`/src/app/api/admin/orders/[id]/status/route.ts`):
- Enhanced with automatic timestamp tracking
- Sets `shippedAt` when status changes to SHIPPED
- Sets `deliveredAt` when status changes to DELIVERED  
- Sets `cancelledAt` when status changes to CANCELLED

**UI Component** (`/src/components/admin/order-status-update.tsx`):
- Updated to show simplified statuses: Pending, Processing, Shipped, Delivered, Cancelled
- Maintains toast notifications for success/error feedback

**Orders Page** (`/src/app/admin/orders/page.tsx`):
- Updated filter dropdown to match the simplified 5 statuses

The functionality already existed in the codebase - I've updated it to match your requested status options and added timestamp tracking to the API route.
