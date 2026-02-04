# TASK T005 OUTPUT: Wire Contact Form to Send Emails

## STATUS: COMPLETED

## CHANGES MADE

### 1. Updated `/src/app/api/contact/route.ts`
- Replaced TODO stub with full email implementation
- Added validation for required fields (name, email, message)
- Integrated Prisma to save ContactSubmission to database
- Sends confirmation email to customer
- Sends notification email to admin (nick@printguys.ca)
- Handles errors gracefully (DB save failure doesn't block emails)

### 2. Prisma Schema
- ContactSubmission model already existed - no changes needed
- Location: lines 780-792 in prisma/schema.prisma

### 3. Email Service
- Already set up from T004
- Templates used: `contactConfirmation` and `contactNotification`

## HOW IT WORKS

When a user submits the contact form:
1. API validates name, email, and message are present
2. Submission is saved to database (with phone, service optional)
3. Customer receives confirmation email
4. Admin receives notification email with all details
5. Success response returned to frontend

## ENVIRONMENT VARIABLES REQUIRED

```
RESEND_API_KEY=your_key_here
EMAIL_FROM=Printguys <onboarding@resend.dev>
ADMIN_EMAIL=nick@printguys.ca
DATABASE_URL=your_postgres_url
```

## TESTING

To test the contact form:

```bash
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "phone": "647-685-6286",
    "service": "DTF",
    "message": "Test message from contact form"
  }'
```

Expected response:
```json
{
  "success": true,
  "message": "Thank you for your message! We'll get back to you soon."
}
```

TASK_COMPLETED
