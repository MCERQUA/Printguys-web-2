TASK_COMPLETED

I've successfully built the customer dashboard page:

**Created files:**
- `/src/app/dashboard/layout.tsx` - Dashboard layout with auth protection and sidebar navigation
- `/src/app/dashboard/page.tsx` - Overview page with stats (orders, designs, spent, active), recent orders, and quick action buttons

**Key features:**
- Authentication required (redirects to /sign-in if not logged in)
- User welcome message with first name
- 4 stat cards: Total Orders, Saved Designs, Total Spent, Active Orders
- Recent orders list with status badges
- Quick action buttons for "Create New Design" and "Get a Quote"
- Empty state handling for no orders
- Middleware protects dashboard automatically (not in public routes list)

Output written to `/home/nick/Nick/Printguys-AI/printguys-nextjs/z-code-outputs/agent6-T013.md`
