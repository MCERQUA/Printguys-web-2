**TASK_COMPLETED**

Created order history pages for customer dashboard:

1. **`/src/app/dashboard/orders/page.tsx`** - Orders list page with:
   - Order cards showing order number, status badge, date, item count, and price
   - Empty state with CTA
   - Links to order details

2. **`/src/app/dashboard/orders/[id]/page.tsx`** - Order detail page with:
   - Visual progress tracker showing order status flow
   - Order items with product details and pricing breakdown
   - Shipping address and tracking info
   - Customer support contact section

Both pages are compatible with the Prisma schema (using `total` not `totalAmount`, correct OrderStatus enum values, and proper relations).
