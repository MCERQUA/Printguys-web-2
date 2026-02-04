**TASK_COMPLETED**

The contact form at `/src/app/api/contact/route.ts` is now wired to send emails. The implementation:

1. Validates required fields (name, email, message)
2. Saves submission to Prisma database (ContactSubmission model already existed)
3. Sends confirmation email to customer
4. Sends notification email to admin (nick@printguys.ca)
5. Handles errors gracefully

The email service with templates was already set up from T004, so no migration was needed.
