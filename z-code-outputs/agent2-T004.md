# TASK T004 OUTPUT: Email Service Setup (Resend)

## Status: COMPLETED

---

## Summary

Successfully installed and configured Resend email service with reusable email utility and templates.

---

## Files Created

### 1. `/src/lib/email.ts`
**Purpose:** Core email utility with sendEmail function and email templates

**Features:**
- `sendEmail()` function with error handling
- `emailTemplates` object with 3 templates:
  - `contactConfirmation(name)` - Auto-reply to contact form submissions
  - `contactNotification(data)` - Admin notification for new contact forms
  - `orderConfirmation(orderNumber, items, total)` - Order confirmation emails

**TypeScript interfaces:**
- `SendEmailParams` - Type-safe email parameters

---

### 2. `/src/app/api/test-email/route.ts`
**Purpose:** Test endpoint for verifying email configuration

**Usage:**
```bash
# GET - Shows usage info
curl http://localhost:3000/api/test-email

# POST - Send test emails
curl -X POST http://localhost:3000/api/test-email \
  -H "Content-Type: application/json" \
  -d '{"to":"your-email@example.com","type":"test"}'

# Available types:
# - test: Basic test email
# - contact-confirmation: Test contact confirmation template
# - contact-notification: Test admin notification template
# - order-confirmation: Test order confirmation template
```

---

## Environment Variables Added to `.env.local`

```bash
# Email Service (Resend)
# Get your API key from https://resend.com/api-keys
RESEND_API_KEY="re_xxxxx"  # Replace with actual API key from resend.com
EMAIL_FROM="Printguys <onboarding@resend.dev>"  # Update with verified domain
ADMIN_EMAIL="nick@printguys.ca"
```

---

## Installation

```bash
npm install resend
```

**Result:** Package installed successfully
- Added 3 packages
- No conflicts

---

## Usage Example

```typescript
import { sendEmail, emailTemplates } from '@/lib/email'

// Send contact confirmation
const template = emailTemplates.contactConfirmation('John')
await sendEmail({
  to: 'john@example.com',
  subject: template.subject,
  html: template.html
})

// Send admin notification
const notification = emailTemplates.contactNotification({
  name: 'John',
  email: 'john@example.com',
  phone: '647-685-6286',
  message: 'I need custom printing...'
})
await sendEmail({
  to: process.env.ADMIN_EMAIL,
  subject: notification.subject,
  html: notification.html
})
```

---

## Next Steps Required

### 1. Get Resend API Key
1. Go to https://resend.com/api-keys
2. Create an account (free tier available: 3,000 emails/month)
3. Generate an API key
4. Update `.env.local`: `RESEND_API_KEY="re_your_actual_key"`

### 2. Verify Domain (Optional but Recommended)
1. In Resend dashboard, add domain: `printguys.ca`
2. Add DNS records provided by Resend
3. Update `.env.local`: `EMAIL_FROM="Printguys <orders@printguys.ca>"`

### 4. Test the Service
```bash
# Start dev server
npm run dev

# Test with curl
curl -X POST http://localhost:3000/api/test-email \
  -H "Content-Type: application/json" \
  -d '{"to":"your-email@example.com","type":"test"}'
```

---

## Templates Included

| Template | Purpose | Recipient |
|----------|---------|-----------|
| `contactConfirmation` | Auto-reply to contact form | User who submitted |
| `contactNotification` | Notify admin of new inquiry | `ADMIN_EMAIL` |
| `orderConfirmation` | Order receipt/confirmation | Customer |

---

## API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/test-email` | GET | Show usage info |
| `/api/test-email` | POST | Send test email |

---

## Security Notes

- API key stored in environment variable (not committed to git)
- `.env.local` is in `.gitignore`
- Email templates use inline HTML for Resend compatibility
- Error handling prevents API key exposure in error messages

---

TASK_COMPLETED
