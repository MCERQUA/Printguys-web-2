## Summary

I have successfully added order confirmation email functionality to the Printguys application. Here's what was implemented:

### Changes Made:

1. **Updated `/src/app/api/orders/route.ts`** (lines 1-3, 126-169):
   - Added imports for `sendEmail` and `emailTemplates` from the existing email utility
   - Added customer confirmation email sending when a new order/quote is created
   - Added admin notification email when a new order/quote is created
   - Both email sends include error handling that allows the order to complete even if email fails

2. **Updated `/.env.example`** (lines 18-21):
   - Added `RESEND_API_KEY` configuration
   - Added `EMAIL_FROM` configuration for sender email
   - Added `ADMIN_EMAIL` configuration for admin notifications

### Email Flow:

**When a customer creates an order/quote:**
1. Order is saved to in-memory storage
2. Customer receives "Order Received" email with:
   - Order number
   - Order details
   - What to expect next
   - Contact information
3. Admin receives notification email with:
   - Order summary
   - Link to view order

**When a payment is completed via Stripe:**
- The existing webhook at `/src/app/api/webhooks/stripe/route.ts` already handles sending confirmation emails for paid orders

### Environment Variables Required:

The user needs to add these to their `.env.local`:
```bash
RESEND_API_KEY=re_...
EMAIL_FROM=Printguys <your-verified-email@resend.dev>
ADMIN_EMAIL=nick@printguys.ca
```

TASK_COMPLETED
